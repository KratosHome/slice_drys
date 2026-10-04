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
  | 'purchase'

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  sliceDrysAnalyticsInitialized?: boolean
}

const trackedPurchases = new Set<string>()
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

export function trackEcommerceEvent(
  event: EcommerceEvent,
  items: AnalyticsItem[],
  parameters: Record<string, string | number> = {},
): boolean {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  if (
    process.env.NODE_ENV === 'development' ||
    typeof window === 'undefined' ||
    !measurementId ||
    !/^G-[A-Z0-9]+$/.test(measurementId)
  )
    return false

  const validItems = items.filter(
    (item) =>
      item.item_id &&
      Number.isFinite(item.price) &&
      item.price > 0 &&
      Number.isSafeInteger(item.quantity) &&
      item.quantity > 0,
  )
  if (validItems.length === 0 && event !== 'view_cart') return false

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
      currency: 'UAH',
      value: roundMoney(
        validItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      ),
      ...parameters,
      items: validItems,
    })
    return true
  } catch {
    // Analytics must never interrupt adding to the cart or placing an order.
    return false
  }
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

export function trackPurchase(receipt: IOrderReceipt): boolean {
  const { transactionId } = receipt
  if (
    !transactionId ||
    trackedPurchases.has(transactionId) ||
    receipt.currency !== 'UAH' ||
    !Number.isFinite(receipt.value) ||
    receipt.value <= 0 ||
    !receipt.items.length ||
    receipt.items.some(
      (item) =>
        !item.id ||
        !Number.isFinite(item.price) ||
        item.price <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0,
    ) ||
    receipt.value !==
      roundMoney(
        receipt.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      )
  )
    return false

  const storageKey = `ga4-purchase:${transactionId}`
  try {
    if (window.sessionStorage.getItem(storageKey)) return false
  } catch {
    // Browsers may disable storage. GA4 also deduplicates transaction IDs.
  }

  // Only the saved order's receipt supplies the purchase total and unit prices.
  const items = receipt.items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    item_variant: `${item.weight} g`,
    price: item.price,
    quantity: item.quantity,
  }))
  const tracked = trackEcommerceEvent('purchase', items, {
    transaction_id: transactionId,
    value: receipt.value,
  })
  if (!tracked) return false

  trackedPurchases.add(transactionId)
  try {
    window.sessionStorage.setItem(storageKey, '1')
  } catch {
    // In-memory deduplication still covers repeated callbacks in this page.
  }
  return true
}
