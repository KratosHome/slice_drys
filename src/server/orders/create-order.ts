'use server'

import { connectToDb } from '@/server/connectToDb'
import { Order } from './orderSchema'

export async function createOrder(orderData: IOrder) {
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
