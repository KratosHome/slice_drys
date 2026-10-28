interface IResponse {
  success: boolean
  message: string
}

interface IOrderResponse {
  success: boolean
  message: Partial<Record<ILocale, string>>
  receipt?: IOrderReceipt
  customerReview?: import('./google-customer-reviews').CustomerReviewOrder
}

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
