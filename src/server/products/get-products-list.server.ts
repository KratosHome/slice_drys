'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'
import { Category } from '@/server/categories/categories-schema'

interface IGetProductsParams {
  page: number
  limit: number
  menu: string
  locale: ILocale
  categories?: string[]
  minWeight?: string
  maxWeight?: string
}

export async function getProductsList({
  page,
  limit,
  menu,
  locale,
  categories,
  minWeight,
  maxWeight,
}: IGetProductsParams) {
  try {
    await connectToDb()

    const categoryDoc = await Category.findOne({ slug: menu })
    if (!categoryDoc) {
      return {
        data: [],
        success: false,
        message: `Category with slug "${menu}" not found`,
      }
    }

    const query: IQueryType = {}

    query.categories = categoryDoc._id

    if (categories && categories.length > 0) {
      const categoryDocs = await Category.find({ slug: { $in: categories } })
      const categoryIds = categoryDocs.map((cat) => cat._id)
      query.categories = { $in: categoryIds }
    }

    if (minWeight || maxWeight) {
      query['variables.weight'] = {}
      if (minWeight) query['variables.weight'].$gte = Number(minWeight)
      if (maxWeight) query['variables.weight'].$lte = Number(maxWeight)
    }

    const skip = (page - 1) * limit
    const products = await Product.find(query).skip(skip).limit(limit).lean()

    const localizedProducts = products.map((product) => ({
      ...product,
      name: product.name[locale],
      description: product.description[locale],
      menu: product.menu[locale],
      composition: product.composition[locale],
    }))

    return {
      data: localizedProducts,
      success: true,
      message: 'Products retrieved successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve products: ${error}`,
    }
  }
}
