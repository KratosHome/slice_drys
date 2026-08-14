interface ICreateOrderProduct {
  id: string
  count: number
  weight: number
}

interface ICreateOrderUser {
  name: string
  surname: string
  phone: string
  email: string
}

type ICreateOrderDelivery =
  | {
      city: string
      department: string
      phone: string
    }
  | {
      courier: string
      phone: string
    }

interface ICreateOrderInput {
  products: ICreateOrderProduct[]
  user: ICreateOrderUser
  delivery: ICreateOrderDelivery
  payment: {
    method: 'cash' | 'card'
  }
  comment: string
  referralCode?: string
  noCall?: boolean
}
