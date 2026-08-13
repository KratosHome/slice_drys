'use server'

import { Product } from '@/server/products/product-schema.server'

import { connectToDbServer } from '@/server/connect-to-db.server'

export interface ProductSitemapEntry {
  slug: string
  categories: Array<{
    slug: string
    parentCategory?: unknown
  }>
  updatedAt: Date
}

export async function getProductsUrls(): Promise<IResult<ProductSitemapEntry>> {
  try {
    await connectToDbServer()

    const products = await Product.find({})
      .select('slug categories updatedAt')
      .populate('categories', 'slug parentCategory')
      .lean<ProductSitemapEntry[]>()

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
