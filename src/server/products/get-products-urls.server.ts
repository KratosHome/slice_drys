'use server'

import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'

export async function getProductsUrls() {
  try {
    await connectToDb()

    const products = await Product.find({})
      .select('slug categories')
      .populate('categories', 'slug')
      .lean()

    const productsWithLowercaseSlug = products.map((product) => ({
      ...product,
      slug: product.slug.toLowerCase(),
    }))

    return {
      data: productsWithLowercaseSlug,
      success: true,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve products ${error}`,
    }
  }
}
