'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export async function getCategories() {
  'use server'
  try {
    await connectToDb()

    const categories = await Category.find({ parentCategory: null })
      .populate({
        path: 'children',
        populate: {
          path: 'children',
        },
      })
      .lean()

    const plainCategories = JSON.parse(JSON.stringify(categories))

    return {
      data: plainCategories,
      success: true,
      message: 'Categories retrieved successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve categories: ${error}`,
    }
  }
}
