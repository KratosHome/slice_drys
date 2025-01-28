import { connectToDb } from '@/server/connectToDb'
import { Order } from './orderSchema'

export async function getOrders() {
  try {
    await connectToDb()

    const orderDocs = await Order.find()

    const orders: IOrder[] = orderDocs.map((orderDoc) => ({
      id: orderDoc._id.toString(),
      status: orderDoc.status,
      products: orderDoc.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        count: product.count,
        price: product.price,
      })),
      total: orderDoc.total,
      user: {
        id: orderDoc.user.id,
        name: orderDoc.user.name,
        surname: orderDoc.user.surname,
        phone: orderDoc.user.phone,
        email: orderDoc.user.email,
      },
      delivery: {
        city: orderDoc.delivery.city,
        department: orderDoc.delivery.department,
        phone: orderDoc.delivery.phone,
      },
      payment: {
        method: orderDoc.payment.method,
      },
      comment: orderDoc.comment || '',
    }))

    const totalOrders = await Order.countDocuments()

    return { success: true, orders, totalOrders }
  } catch (error) {
    return {
      success: false,
      message: `Cannot retrieve orders: ${error}`,
    }
  }
}
