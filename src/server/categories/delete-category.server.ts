'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Category } from '@/server/categories/categories-schema.server'
import { fetchTags } from '@/data/fetch-tags'

import { revalidateTag } from 'next/cache'

export async function deleteCategory(categoryId: string): Promise<IResponse> {
  'use server'
  try {
    await connectToDbServer()

    const category = await Category.findById(categoryId)

    if (!category) {
      return {
        success: false,
        message: 'Категорію не знайдено',
      }
    }

    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { children: categoryId },
      })
    }

    await Category.deleteOne({ _id: categoryId })

    revalidateTag(fetchTags.menu, 'max')
    revalidateTag(fetchTags.products, 'max')

    return {
      success: true,
      message: 'Категорію видалено успішно',
    }
  } catch (error) {
    return {
      success: false,
      message: `Помилка при видаленні категорії: ${error}`,
    }
  }
}
