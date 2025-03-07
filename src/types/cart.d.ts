interface IDeliveryInfo {
  city?: string
  brunch?: string
  deliveryMethod?: string
  courierInfo?: string
}

interface IUserData {
  name?: string
  surname?: string
  phoneNumber?: string
  email?: string
  formStep?: number
  deliveryInfo?: IDeliveryInfo
  paymentInfo?: string
  comment?: string
  acceptTerms?: boolean
  noCall?: boolean
}

interface ICartItem {
  id: string
  quantity: number
  image: string
  name: string
  price: number
  weight: number
  maxQuantity: number
}

interface ICart {
  itemList?: ICartItem[] | undefined
  userData?: IUserData | undefined
}
