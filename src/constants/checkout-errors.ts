export const CHECKOUT_ERROR_CODES = [
  'cart_empty',
  'invalid_order',
  'product_unavailable',
  'minimum_order_amount',
  'idempotency_conflict',
  'order_unconfirmed',
  'transport_error',
  'checkout_unavailable',
] as const

export type CheckoutErrorCode = (typeof CHECKOUT_ERROR_CODES)[number]
