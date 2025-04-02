import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export async function getCategoryUrls() {
  'use server'
  try {
    await connectToDb()

    const categories = await Category.find({}).select('slug').lean()

    const categoriesWithLowercaseSlug = categories.map((category) => ({
      ...category,
      slug: category.slug.toLowerCase(),
    }))

    return {
      data: categoriesWithLowercaseSlug,
      success: true,
      message: 'Categories retrieved',
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve categories: ${error}`,
    }
  }
}
