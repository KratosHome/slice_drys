interface IOrderProduct {
  id: string
  name: string
  count: number
  price: number
}

interface IOrderUser {
  id: string
  name: string
  surname: string
  phone: string
  email: string
}

interface IOrderDelivery {
  city: string
  department: string
  phone: string
}

interface IOrder {
  id: string
  status:
    | 'new'
    | 'awaitingPayment'
    | 'awaitingShipment'
    | 'shipped'
    | 'completed'
    | 'awaitingReturn'
    | 'cancelled'
    | 'failedDelivery'
  products: IOrderProduct[]
  total: number
  user: IOrderUser
  delivery: IOrderDelivery
  payment: {
    method: 'cash' | 'card'
  }
  comment: string
}
