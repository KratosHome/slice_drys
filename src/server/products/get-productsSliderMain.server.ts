'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'
import { IProductLocal, IVariableProduct } from '@/types/product'

export const getProductsSliderMain = async (): Promise<IProductLocal[]> => {
  console.time('fetch-products')

  try {
    await connectToDb()

    const products = (
      await Product.find()
        .sort({ visited: -1 })
        .limit(7)
        .lean<IProductLocal[]>()
    ).map((product) => ({
      ...product,
      name: product.name,
      description: product.description,
      statusLabel: product.statusLabel,
      visited: product.visited,
      variables: product.variables.map((variant: IVariableProduct) => ({
        ...variant,
        weight: Number(variant.weight),
        price: Number(variant.price),
        newPrice: variant.newPrice ? Number(variant.newPrice) : 0,
      })),
    }))

    console.timeEnd('fetch-products')
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw new Error('Failed to fetch top products. Please try again later.')
  }
}
