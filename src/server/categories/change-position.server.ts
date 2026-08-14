'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Category } from '@/server/categories/categories-schema.server'
import { requirePermission } from '@/server/auth/require-admin.server'

export async function changePosition(categoriesOrder: ICategory[]) {
  'use server'
  await requirePermission('categories:manage')

  try {
    await connectToDbServer()

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
    console.error('Admin category reorder failed', error)

    return {
      success: false,
      message: 'Не вдалося змінити порядок категорій',
    }
  }
}
