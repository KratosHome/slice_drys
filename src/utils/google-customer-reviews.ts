import type { CustomerReviewOrder } from '@/types/google-customer-reviews'

export const GOOGLE_CUSTOMER_REVIEWS_MERCHANT_ID = 5571397067

type SurveyOptIn = {
  merchant_id: number
  order_id: string
  email: string
  delivery_country: string
  estimated_delivery_date: string
}

type CustomerReviewsWindow = Window & {
  gapi?: {
    load: (module: 'surveyoptin', callback: () => void) => void
    surveyoptin?: { render: (order: SurveyOptIn) => void }
  }
}

const renderedOrders = new Set<string>()

export function getCustomerReviewPayload(
  order: CustomerReviewOrder,
): SurveyOptIn | undefined {
  const date = new Date(`${order.estimatedDeliveryDate}T00:00:00.000Z`)
  if (
    !order.orderId.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email) ||
    order.deliveryCountry !== 'UA' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(order.estimatedDeliveryDate) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== order.estimatedDeliveryDate
  )
    return undefined

  return {
    merchant_id: GOOGLE_CUSTOMER_REVIEWS_MERCHANT_ID,
    order_id: order.orderId,
    email: order.email,
    delivery_country: order.deliveryCountry,
    estimated_delivery_date: order.estimatedDeliveryDate,
  }
}

/** Google being blocked or unavailable must never interrupt order confirmation. */
export function renderCustomerReviewOptIn(
  order: CustomerReviewOrder,
  isActive: () => boolean,
): void {
  if (typeof window === 'undefined') return
  const payload = getCustomerReviewPayload(order)
  if (!payload || renderedOrders.has(order.orderId) || !isActive()) return

  try {
    const { gapi } = window as CustomerReviewsWindow
    if (!gapi) return
    gapi.load('surveyoptin', () => {
      if (
        !isActive() ||
        renderedOrders.has(order.orderId) ||
        !gapi.surveyoptin
      )
        return

      // Reserve before calling Google, including synchronous repeated callbacks.
      renderedOrders.add(order.orderId)
      try {
        gapi.surveyoptin.render(payload)
      } catch {
        renderedOrders.delete(order.orderId)
      }
    })
  } catch {
    // The saved order and its confirmation remain usable without Google's script.
  }
}
