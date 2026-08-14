export const ORDER_STATUSES = [
  'new',
  'awaitingPayment',
  'awaitingShipment',
  'shipped',
  'completed',
  'awaitingReturn',
  'cancelled',
  'failedDelivery',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Нове',
  awaitingPayment: 'Очікує оплати',
  awaitingShipment: 'Очікує відправки',
  shipped: 'Відправлено',
  completed: 'Виконано',
  awaitingReturn: 'Очікує повернення',
  cancelled: 'Скасовано',
  failedDelivery: 'Не доставлено',
}

export const ORDER_STATUS_BY_SLUG = {
  new: 'new',
  'awaiting-payment': 'awaitingPayment',
  'awaiting-shipment': 'awaitingShipment',
  shipped: 'shipped',
  completed: 'completed',
  'awaiting-return': 'awaitingReturn',
  cancelled: 'cancelled',
  'failed-delivery': 'failedDelivery',
} as const satisfies Record<string, OrderStatus>

export type OrderStatusSlug = keyof typeof ORDER_STATUS_BY_SLUG

export const ORDER_STATUS_SLUGS = Object.keys(
  ORDER_STATUS_BY_SLUG,
) as OrderStatusSlug[]

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === 'string' && ORDER_STATUSES.includes(value as OrderStatus)
  )
}

export function isOrderStatusSlug(value: unknown): value is OrderStatusSlug {
  return typeof value === 'string' && Object.hasOwn(ORDER_STATUS_BY_SLUG, value)
}

export function getOrderStatusFromSlug(
  value: unknown,
): OrderStatus | undefined {
  return isOrderStatusSlug(value) ? ORDER_STATUS_BY_SLUG[value] : undefined
}
