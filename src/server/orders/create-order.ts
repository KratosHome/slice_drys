'use server'

interface Product {
  id: string
  name: string
  count: number
  price: number
}

interface User {
  id: string
  name: string
  surname: string
  phone: string
  email: string
}

interface Delivery {
  city: string
  department: string
  phone: string
}

interface Payment {
  method: string
}

interface OrderData {
  status:
    | 'new'
    | 'awaitingPayment'
    | 'awaitingShipment'
    | 'shipped'
    | 'completed'
    | 'awaitingReturn'
    | 'cancelled'
    | 'failedDelivery'
  products?: Product[]
  total?: number
  user?: User
  delivery?: Delivery
  payment?: Payment
  comment?: string
}
import { connectToDb } from '@/server/connectToDb'
import { Order } from './orderSchema'

export async function createOrder(orderData: OrderData) {
  try {
    await connectToDb()

    const order = new Order(orderData)
    await order.save()

    return { success: true, message: 'Order created' }
  } catch (error) {
    return {
      success: false,
      message: `Can't create order: ${error}`,
    }
  }
}
