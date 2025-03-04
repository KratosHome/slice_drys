'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export async function deleteCategory(categoryId: string) {
  'use server'

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
