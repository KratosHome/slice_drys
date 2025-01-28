'use server'

import { connectToDb } from '@/server/connectToDb'
import { Order } from './orderSchema'

export async function createOrUpdateOrder(orderData: Partial<IOrder>) {
  try {
    await connectToDb()
    console.log(orderData)
    const existingOrder = await Order.findById(orderData.id)

    if (existingOrder) {
      Object.assign(existingOrder, orderData)
      await existingOrder.save()

      return { success: true, message: 'Order updated' }
    } else {
      const order = new Order(orderData)
      await order.save()

      return { success: true, message: 'Order created' }
    }
  } catch (error) {
    return {
      success: false,
      message: `Error processing order: ${error}`,
    }
  }
}
