'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'
import { Category } from '@/server/categories/categories-schema'

export async function getProductWeights(categorySlug: string) {
  try {
    await connectToDb()

    const categoryDoc = await Category.findOne({ slug: categorySlug })

    if (!categoryDoc) {
      return {
        data: [],
        success: false,
        message: `Category with slug "${categorySlug}" not found`,
      }
    }

    const products = await Product.find({ categories: categoryDoc._id }).lean()

    const weights = products.flatMap(
      (product) =>
        product.variables?.map(
          (variant: { weight: number }) => variant.weight,
        ) || [],
    )

    const uniqueWeights = Array.from(new Set(weights)).sort((a, b) => a - b)

    return {
      data: uniqueWeights,
      success: true,
      message: 'Weights retrieved successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve weights: ${error}`,
    }
  }
}
