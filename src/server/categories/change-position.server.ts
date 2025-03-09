'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export async function changePosition(categoriesOrder: ICategory[]) {
  'use server'
  try {
    await connectToDb()

    const bulkOps = categoriesOrder.map(({ _id, order }) => ({
      updateOne: {
        filter: { _id: _id },
        update: { $set: { order } },
      },
    }))

    await Category.bulkWrite(bulkOps)

    return {
      success: true,
      message: 'Категорію створено успішно',
    }
  } catch (error) {
    return {
      success: false,
      message: `Помилка при створенні категорії: ${error}`,
    }
  }
}
