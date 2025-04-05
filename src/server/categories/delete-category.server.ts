'use server'

import { Category } from '@/server/categories/categories-schema'
import { fetchTags } from '@/data/fetch-tags'

import { connectToDb } from '@/server/connectToDb'
import { revalidateTag } from 'next/cache'

export async function deleteCategory(categoryId: string): Promise<IResponse> {
  try {
    await connectToDb()

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

    revalidateTag(fetchTags.menu)
    revalidateTag(fetchTags.products)

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
