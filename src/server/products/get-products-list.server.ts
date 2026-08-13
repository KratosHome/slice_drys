'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import { Category } from '@/server/categories/categories-schema.server'
import { getCanonicalProductCategorySlug } from '@/utils/product-category'

export interface IGetProductsParams {
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
  'use server'
  try {
    await connectToDbServer()

    const categoryDoc = await Category.findOne({ slug: menu.toLowerCase() })
    if (!categoryDoc) {
      return {
        data: [],
        success: false,
        message: `Category with slug "${menu}" not found`,
      }
    }

    const query: Record<string, unknown> = { categories: categoryDoc._id }

    if (categories && categories.length > 0) {
      const normalizedCategories = Array.from(
        new Set(categories.map((category) => category.toLowerCase())),
      )
      const categoryDocs = await Category.find({
        slug: { $in: normalizedCategories },
      })

      if (categoryDocs.length !== normalizedCategories.length) {
        return {
          data: [],
          success: false,
          message: 'One or more selected categories were not found',
        }
      }

      const categoryIds = categoryDocs.map((cat) => cat._id)
      query.$and = [
        { categories: categoryDoc._id },
        { categories: { $in: categoryIds } },
      ]
      delete query.categories
    }

    if (minWeight || maxWeight) {
      const weightQuery: { $gte?: number; $lte?: number } = {}
      if (minWeight) weightQuery.$gte = Number(minWeight)
      if (maxWeight) weightQuery.$lte = Number(maxWeight)
      query['variables.weight'] = weightQuery
    }

    const skip = (page - 1) * limit
    const products = await Product.find(query)
      .sort({ visited: -1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .populate('categories', 'slug parentCategory')
      .lean()

    const totalItems = await Product.countDocuments(query)
    const totalPages = Math.ceil(totalItems / limit)

    const localizedProducts = products.map((product) => {
      const populatedCategories = product.categories as unknown as Array<{
        _id: unknown
        slug: string
        parentCategory?: unknown
      }>

      return {
        _id: product._id?.toString(),
        slug: product.slug,
        name: product.name[locale],
        category: getCanonicalProductCategorySlug(populatedCategories) ?? menu,
        description: product.description[locale],
        metaDescription: product.metaDescription?.[locale],
        img: product.img,
        variables: JSON.parse(JSON.stringify(product.variables)),
        statusLabel: product.statusLabel,
        categories: populatedCategories.map((category) => String(category._id)),
        images: [],
      }
    })

    return {
      data: localizedProducts,
      currentPage: page,
      success: true,
      message: 'Products retrieved successfully',
      totalItems,
      totalPages,
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve products: ${error}`,
    }
  }
}
