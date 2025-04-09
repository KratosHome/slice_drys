interface IResponse {
  success: boolean
  message: string
}

interface IOrderResponse {
  success: boolean
  message: Partial<Record<ILocale, string>>
}
