'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'

export async function getProductsSliderMain(locale: ILocale) {
  try {
    await connectToDb()

    const products = await Product.find()
      .sort({ visited: -1 })
      .limit(7)
      .lean<IProductLocal[]>()

    const formattedProducts: IProduct[] = products.map(
      (product: IProductLocal) => ({
        ...product,
        _id: product._id as string,
        name: product.name[locale],
        description: product.description[locale],
        category: product.category[locale],
        menu: product.menu[locale],
        composition: product.composition[locale],
        variables: product.variables,
        statusLabel: product.statusLabel,
        nutritionalValue: product.nutritionalValue,
      }),
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
      message: error,
    }
  }
}
