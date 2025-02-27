'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

type CreateCategoryDTO = Omit<ICategory, '_id' | 'children'>

export async function createCategory(categoryData: CreateCategoryDTO) {
  'use server'

  try {
    await connectToDb()

    const newCategory = await Category.create(categoryData)

    if (newCategory.parentCategory) {
      await Category.findByIdAndUpdate(newCategory.parentCategory, {
        $push: { children: newCategory._id },
      })
    }

    return {
      data: newCategory,
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
