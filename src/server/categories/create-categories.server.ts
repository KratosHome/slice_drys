'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'

type CreateCategoryDTO = Omit<ICategory, '_id' | 'children'>

export async function createCategory(categoryData: CreateCategoryDTO) {
  'use server'

  try {
    await connectToDbServer()

    const newCategory = await Category.create(categoryData)

    if (newCategory.parentCategory) {
      await Category.findByIdAndUpdate(newCategory.parentCategory, {
        $push: { children: newCategory._id },
      })
    }

    revalidateTag(fetchTags.menu)
    revalidateTag(fetchTags.products)

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
