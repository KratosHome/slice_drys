'use server'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Category } from '@/server/categories/categories-schema.server'
import { requirePermission } from '@/server/auth/require-admin.server'

type CreateCategoryDTO = Omit<ICategory, '_id' | 'children'>

export async function createCategory(categoryData: CreateCategoryDTO) {
  'use server'
  await requirePermission('categories:manage')

  try {
    await connectToDbServer()

    const newCategory = await Category.create(categoryData)

    if (newCategory.parentCategory) {
      await Category.findByIdAndUpdate(newCategory.parentCategory, {
        $push: { children: newCategory._id },
      })
    }

    revalidateTag(fetchTags.menu, 'max')
    revalidateTag(fetchTags.products, 'max')

    return {
      data: newCategory,
      success: true,
      message: 'Категорію створено успішно',
    }
  } catch (error) {
    console.error('Admin category creation failed', error)

    return {
      success: false,
      message: 'Не вдалося створити категорію',
    }
  }
}
