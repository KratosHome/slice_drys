'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'

export async function getProductsSliderProduct(
  locale: ILocale,
  productSlug: string,
) {
  try {
    await connectToDb()

    const aggregatedProducts = await Product.aggregate([
      { $match: { slug: { $ne: productSlug } } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', product: { $first: '$$ROOT' } } },
      { $group: { _id: '$product._id', product: { $first: '$product' } } },
      { $limit: 7 },
    ])

    const formattedProducts: IProduct[] = aggregatedProducts.map(
      ({ product }: { product: IProductLocal }) => ({
        ...product,
        _id: product._id?.toString(),
        name: product.name[locale],
        description: product.description[locale],
        categories: product.categories ?? [],
        menu: product.menu[locale],
        composition: product.composition[locale],
        variables: JSON.parse(JSON.stringify(product.variables)),
        statusLabel: product.statusLabel,
        nutritionalValue: product.nutritionalValue,
        title: product.title[locale],
        metaDescription: product.metaDescription[locale],
        keywords: product.keywords[locale],
        images: product.images,
      }),
    )

    const uniqueProducts = Array.from(
      new Map(formattedProducts.map((item) => [item._id, item])).values(),
    )

    return {
      success: true,
      data: uniqueProducts,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `${error}`,
    }
  }
}
