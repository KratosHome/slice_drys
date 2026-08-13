'use server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import { getCanonicalProductCategorySlug } from '@/utils/product-category'

export async function getProductsSliderProduct(
  locale: ILocale,
  productSlug: string,
) {
  try {
    await connectToDbServer()

    const products = await Product.find({ slug: { $ne: productSlug } })
      .sort({ visited: -1, _id: 1 })
      .limit(7)
      .populate('categories', 'slug parentCategory')
      .lean<IProductLocal[]>()

    const formattedProducts: IProduct[] = products.map((product) => {
      const populatedCategories = product.categories as unknown as Array<{
        _id: string
        slug: string
        parentCategory?: unknown
      }>
      return {
        ...JSON.parse(JSON.stringify(product)),
        _id: product._id?.toString(),
        name: product.name[locale],
        description: product.description[locale],
        categories: populatedCategories.map((category) =>
          category._id.toString(),
        ),
        category: getCanonicalProductCategorySlug(populatedCategories) ?? '',
        menu: product.menu[locale],
        composition: product.composition[locale],
        variables: JSON.parse(JSON.stringify(product.variables)),
        statusLabel: product.statusLabel,
        nutritionalValue: product.nutritionalValue,
        title: product.title[locale],
        metaDescription: product.metaDescription[locale],
        keywords: product.keywords[locale],
        images: [],
      }
    })

    return {
      success: true,
      data: formattedProducts,
      message: 'Products retrieved',
    }
  } catch (error) {
    return { success: false, data: [], message: `${error}` }
  }
}
