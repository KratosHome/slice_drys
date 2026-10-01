interface IResponse {
  success: boolean
  message: string
}

interface IOrderResponse {
  success: boolean
  message: Partial<Record<ILocale, string>>
  receipt?: IOrderReceipt
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
