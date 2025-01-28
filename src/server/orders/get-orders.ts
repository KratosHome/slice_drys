import { connectToDb } from '@/server/connectToDb'
import { Order } from './orderSchema'

export async function getOrders(page: number, limit: number) {
  try {
    await connectToDb()

    const skip = (page - 1) * limit

    const orders = await Order.find().skip(skip).limit(limit)

    // Отримуємо загальну кількість замовлень
    const totalOrders = await Order.countDocuments()

    // Повертаємо об'єкт з замовленнями і загальною кількістю
    return { success: true, orders, totalOrders }
  } catch (error) {
    // Обробка помилки
    return {
      success: false,
      message: `Cannot retrieve orders: ${error}`,
    }
  }
}
