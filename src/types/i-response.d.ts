interface IResponse {
  success: boolean
  message: string
}

type IOrderResponse = {
  message: Partial<Record<ILocale, string>>
} & (
  | {
      success: true
      errorCode?: never
      receipt: IOrderReceipt
      customerReview?: import('./google-customer-reviews').CustomerReviewOrder
    }
  | {
      success: false
      errorCode: import('../constants/checkout-errors').CheckoutErrorCode
      receipt?: never
      customerReview?: never
    }
)

interface IOrderReceipt {
  transactionId: string
  currency: 'UAH'
  value: number
  items: Array<{
    id: string
    name: string
    weight: number
    price: number
    quantity: number
  }>
}
