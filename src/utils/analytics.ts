import {
  CHECKOUT_ERROR_CODES,
  type CheckoutErrorCode,
} from '@/constants/checkout-errors'
import { getProductPrice } from '@/utils/product-price'

export interface AnalyticsItem {
  item_id: string
  item_name: string
  item_variant: string
  price: number
  quantity: number
  item_category?: string
  discount?: number
  index?: number
}

export interface AnalyticsList {
  id: string
  name: string
  index?: number
}

type EcommerceEvent =
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  sliceDrysAnalyticsInitialized?: boolean
}

const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100

export function getProductAnalyticsItem(
  product: Pick<IProduct, '_id' | 'name' | 'category'>,
  variant: IVariableProduct,
  quantity = 1,
): AnalyticsItem | undefined {
  const price = getProductPrice(variant)
  if (!product._id || price === undefined) return undefined

  const discount = variant.price - price
  return {
    item_id: product._id,
    item_name: product.name,
    item_variant: `${variant.weight} g`,
    price,
    quantity,
    ...(product.category ? { item_category: product.category } : {}),
    ...(discount > 0 ? { discount: roundMoney(discount) } : {}),
  }
}

export function getCartAnalyticsItems(items: ICartItem[]): AnalyticsItem[] {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    item_variant: `${item.weight} g`,
    price: item.price,
    quantity: item.quantity,
  }))
}

function queueEvent(
  event:
    | EcommerceEvent
    | 'generate_lead'
    | 'checkout_error'
    | 'contact_click'
    | 'newsletter_signup',
  parameters: Record<string, unknown>,
): 'queued' | 'skipped' {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  if (
    process.env.NODE_ENV === 'development' ||
    typeof window === 'undefined' ||
    !measurementId ||
    !/^G-[A-Z0-9]+$/.test(measurementId)
  )
    return 'skipped'

  try {
    const analyticsWindow = window as AnalyticsWindow
    analyticsWindow.dataLayer ??= []
    // Keep early actions queued even while the external Google script loads.
    analyticsWindow.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params -- Match Google's arguments-object queue format.
      analyticsWindow.dataLayer!.push(arguments)
    }
    if (!analyticsWindow.sliceDrysAnalyticsInitialized) {
      analyticsWindow.gtag('js', new Date())
      analyticsWindow.gtag('config', measurementId)
      analyticsWindow.sliceDrysAnalyticsInitialized = true
    }
    analyticsWindow.gtag('event', event, {
      send_to: measurementId,
      ...parameters,
    })
    return 'queued'
  } catch {
    // Analytics must never interrupt adding to the cart or placing an order.
    return 'skipped'
  }
}

export function trackEcommerceEvent(
  event: EcommerceEvent,
  items: AnalyticsItem[],
  parameters: Record<string, string | number> = {},
): 'queued' | 'skipped' {
  const validItems = items.filter(
    (item) =>
      item.item_id &&
      Number.isFinite(item.price) &&
      item.price > 0 &&
      Number.isSafeInteger(item.quantity) &&
      item.quantity > 0,
  )
  if (validItems.length === 0 && event !== 'view_cart') return 'skipped'
  return queueEvent(event, {
    currency: 'UAH',
    value: roundMoney(
      validItems.reduce((total, item) => total + item.price * item.quantity, 0),
    ),
    ...parameters,
    items: validItems,
  })
}

export function trackCheckoutError(code: CheckoutErrorCode) {
  if (!CHECKOUT_ERROR_CODES.includes(code)) return 'skipped'
  return queueEvent('checkout_error', { error_code: code })
}

export function trackLead(form: 'callback' | 'wholesale') {
  if (form !== 'callback' && form !== 'wholesale') return 'skipped'
  return queueEvent('generate_lead', { form_type: form })
}

export function trackContactClick(method: 'phone' | 'email') {
  if (method !== 'phone' && method !== 'email') return 'skipped'
  return queueEvent('contact_click', { contact_method: method })
}

export function trackNewsletterSignup() {
  return queueEvent('newsletter_signup', {})
}

export function trackProductSelection(
  product: Pick<IProduct, '_id' | 'name' | 'category'>,
  variant: IVariableProduct,
  list?: AnalyticsList,
) {
  const item = getProductAnalyticsItem(product, variant)
  if (!item) return
  trackEcommerceEvent(
    'select_item',
    [{ ...item, ...(list?.index !== undefined ? { index: list.index } : {}) }],
    {
      item_list_id: list?.id || product.category || 'products',
      ...(list?.name ? { item_list_name: list.name } : {}),
    },
  )
}
