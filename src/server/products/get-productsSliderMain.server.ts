'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'

export async function getProductsSliderMain(locale: ILocale) {
  try {
    await connectToDb()

    const products = await Product.find()
      .populate('categories', 'slug')
      .sort({ visited: -1 })
      .limit(7)
      .lean<IProductLocal[]>()

    const formattedProducts: IProduct[] = products.map(
      (product: IProductLocal) => {
        const populatedCategories = product.categories as unknown as {
          _id: string
          slug: string
        }[]
        return {
          ...product,
          _id: product._id?.toString(),
          name: product.name[locale],
          description: product.description[locale],
          categories: populatedCategories
            ? populatedCategories.map((category) => category._id)
            : [],
          category:
            populatedCategories && populatedCategories[0]
              ? populatedCategories[0].slug
              : '',
          menu: product.menu[locale],
          composition: product.composition[locale],
          variables: JSON.parse(JSON.stringify(product.variables)),
          statusLabel: product.statusLabel,
          nutritionalValue: product.nutritionalValue,
          title: product.title[locale],
          metaDescription: product.metaDescription[locale],
          keywords: product.keywords[locale],
          images: product.images,
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
