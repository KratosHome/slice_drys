'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export async function getCategories(slug?: string) {
  'use server'
  try {
    await connectToDb()

    if (slug) {
      const category = await Category.findOne({ slug })
        .populate({
          path: 'children',
          populate: {
            path: 'children',
          },
        })
        .lean<ICategory>()

      if (!category) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        }
      }

      return {
        data: category.children || [],
        success: true,
        message: 'Category children retrieved successfully',
      }
    }

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
