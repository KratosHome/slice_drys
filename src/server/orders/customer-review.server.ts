import type { CustomerReviewOrder } from '@/types/google-customer-reviews'

// The storefront FAQ allows two business days to dispatch, then three days
// in transit. Calculate from the order's date in Ukraine, not the host timezone.
export function getEstimatedDeliveryDate(orderedAt: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(orderedAt)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((value) => value.type === type)?.value)
  const date = new Date(Date.UTC(part('year'), part('month') - 1, part('day')))

  let dispatchDays = 0
  while (dispatchDays < 2) {
    date.setUTCDate(date.getUTCDate() + 1)
    if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) dispatchDays += 1
  }
  date.setUTCDate(date.getUTCDate() + 3)

  return date.toISOString().slice(0, 10)
}

export function createCustomerReviewOrder(
  orderId: string,
  email: string,
  orderedAt: Date = new Date(),
): CustomerReviewOrder {
  return {
    orderId,
    email,
    deliveryCountry: 'UA',
    estimatedDeliveryDate: getEstimatedDeliveryDate(orderedAt),
  }
}
