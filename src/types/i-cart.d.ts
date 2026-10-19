interface IDeliveryInfo<T extends 'branch' | 'postomat' | 'courier', P> {
  city?: T extends 'branch' | 'postomat' ? P : never
  branch?: T extends 'branch' | 'postomat' ? P : never
  deliveryProvider?: string
  deliveryMethod?: T
  courierInfo?: T extends 'courier' ? string : never
}

type PaymentMethods = 'cash' | 'card'

interface IUserData<T> {
  name?: string
  surname?: string
  phoneNumber?: string
  email?: string
  formStep?: number
  deliveryInfo?: T
  paymentInfo?: PaymentMethods
  comment?: string
  acceptTerms?: boolean
  noCall?: boolean
}

interface ICartProductNames {
  id: string
  names: Partial<Record<ILocale, string>>
}

interface ICartItem {
  id: string
  quantity: number
  image: string
  name: string
  names?: ICartProductNames['names']
  price: number
  weight: number
  maxQuantity: number
}

interface ICart {
  itemList?: ICartItem[] | undefined
  userData?:
    | IUserData<IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>>
    | undefined
}
