'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

type UpdateCategoryDTO = Partial<Omit<ICategory, '_id' | 'children'>>

export async function updateCategory(
  categoryId: string,
  categoryData: UpdateCategoryDTO,
) {
  'use server'

  try {
    await connectToDb()

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      categoryData,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedCategory) {
      return {
        success: false,
        message: 'Категорію не знайдено',
      }
    }

    return {
      data: updatedCategory,
      success: true,
      message: 'Категорію оновлено успішно',
    }
  } catch (error) {
    return {
      success: false,
      message: `Помилка при оновленні категорії: ${error}`,
    }
  }
}
