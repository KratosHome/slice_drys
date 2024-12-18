import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'
import { IProduct, IProductLocal } from '@/types/product'

export async function getProducts(
  page = 1,
  limit = 10,
  composition = [],
  menu = [],
  category = [],
  locale: string,
  fetchAll = false,
) {
  'use server'
  try {
    await connectToDb()

    const query: Record<string, any> = {}

    if (composition.length > 0) {
      query[`composition.${locale}`] = { $in: composition }
    }

    if (menu.length > 0) {
      query[`menu.${locale}`] = { $in: menu }
    }

    if (category.length > 0) {
      query[`category.${locale}`] = { $in: category }
    }

    const products = await Product.find(query)
      .select({
        [`name.${locale}`]: 1,
        [`description.${locale}`]: 1,
        img: 1,
        variables: 1,
        nutritionalValue: 1,
        statusLabel: 1,
        visited: 1,
        [`menu.${locale}`]: 1,
        [`category.${locale}`]: 1,
        [`composition.${locale}`]: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .lean()
      .skip((page - 1) * limit)
      .limit(limit)

    const formattedProducts: IProduct[] = products.map((product) => ({
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
      available: product.available,
      weight: product.weight,
      price: product.price,
      badges: product.badges,
      type: product.type,
      label: product.label,
    }))

    const allProducts: IProductLocal[] = fetchAll
      ? ((await Product.find()
          .sort({ createdAt: -1 })
          .lean()) as unknown as IProductLocal[])
      : []

    return {
      success: true,
      product: formattedProducts,
      productAll: allProducts,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      product: [],
      productAll: [],
      message: "Can't retrieve products",
    }
  }
}
