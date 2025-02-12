import { connectToDb } from '../connectToDb'
import { Product } from './productSchema'

// type IProductResult = {
//   success: boolean
//   product: IProduct | null
//   message: string
// }

export async function getProductBySlug({
  slug,
  locale,
}: {
  slug: string
  locale: ILocale
}): Promise<string> {
  'use server'

  try {
    await connectToDb()

    const product = await Product.findOne({ slug })

    const localizedProduct: IProduct = {
      name: product.name[locale],
      description: product.description[locale],
      variables: product.variables,
      category: product.category[locale],
      menu: product.category[locale],
      slug: product.slug,
      composition: product.composition[locale],
      statusLabel: product.statusLabel,
      nutritionalValue: product.nutritionalValue,
    }

    // BUG: JSON because NextJS shows error: RangeError: Maximum call stack size exceeded
    return JSON.stringify({
      success: true,
      product: localizedProduct,
      message: 'Product found',
    })
  } catch (error) {
    return JSON.stringify({
      success: false,
      product: null,
      message: `Product not found: ${error}`,
    })
  }
}
