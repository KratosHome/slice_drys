'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'

export async function getProductsSliderProduct(
  locale: ILocale,
  categories: string[],
  productId: string,
) {
  try {
    await connectToDb()

    let relatedProducts = await Product.find({
      categories: { $in: categories },
      _id: { $ne: productId },
    })
      .limit(7)
      .lean<IProductLocal[]>()

    if (relatedProducts.length < 7) {
      const popularProducts = await Product.find({
        _id: { $ne: productId, $nin: relatedProducts.map((p) => p._id) },
      })
        .sort({ visited: -1 })
        .limit(7 - relatedProducts.length)
        .lean<IProductLocal[]>()

      relatedProducts = [...relatedProducts, ...popularProducts]
    }

    const formattedProducts: IProduct[] = relatedProducts.map(
      (product: IProductLocal) => ({
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

    return {
      success: true,
      data: formattedProducts,
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
