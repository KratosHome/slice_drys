'use server'

import { Product } from '@/server/products/product-schema.server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { getCanonicalProductCategorySlug } from '@/utils/product-category'

export async function getProductsSliderMain(
  locale: ILocale,
): Promise<IGetProducts> {
  try {
    await connectToDbServer()

    const products = await Product.find()
      .populate('categories', 'slug parentCategory')
      .sort({ visited: -1 })
      .limit(5)
      .lean<IProductLocal[]>()

    const formattedProducts: IProduct[] = products.map(
      (product: IProductLocal) => {
        const populatedCategories =
          product.categories as unknown as CategorySlug[]

        return {
          ...product,
          _id: product._id?.toString(),
          name: product.name[locale],
          description: product.description[locale],
          categories: populatedCategories
            ? populatedCategories.map((category) => category._id.toString())
            : [],
          category: getCanonicalProductCategorySlug(populatedCategories) ?? '',
          menu: product.menu[locale],
          composition: product.composition[locale],
          variables: JSON.parse(JSON.stringify(product.variables)),
          statusLabel: product.statusLabel,
          nutritionalValue: product.nutritionalValue,
          title: product.title[locale],
          metaDescription: product.metaDescription[locale],
          keywords: product.keywords[locale],
          // Cards and Product JSON-LD use the verified primary `img` URL.
          // Legacy gallery values are not safe to send through Cloudinary's
          // public-ID helper because some records already contain absolute URLs.
          images: [],
        }
      },
    )

    return {
      success: true,
      products: formattedProducts,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      products: [],
      message: `${error}`,
    }
  }
}
