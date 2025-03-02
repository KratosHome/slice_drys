'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export async function getCurrentCategory(slug: string) {
  'use server'
  try {
    await connectToDb()

    const category = await Category.findOne({ slug }).lean()

    if (!category) {
      return {
        data: null,
        success: false,
        message: 'Category not found',
      }
    }

    return {
      data: category,
      success: true,
      message: 'Category retrieved successfully',
    }
  } catch (error) {
    return {
      data: null,
      success: false,
      message: `Error retrieving category: ${error}`,
    }
  }
}
