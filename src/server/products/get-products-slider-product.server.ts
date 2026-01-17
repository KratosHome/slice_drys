'use server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import cloudinary from '../cloudinary-config.server'

export async function getProductsSliderProduct(
  locale: ILocale,
  productSlug: string,
) {
  try {
    await connectToDbServer()

    const aggregatedProducts = await Product.aggregate([
      { $match: { slug: { $ne: productSlug } } },
      { $unwind: '$categories' },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDoc',
        },
      },
      { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: true } },
      { $addFields: { categorySlug: '$categoryDoc.slug' } },

      { $group: { _id: '$categories', product: { $first: '$$ROOT' } } },
      { $group: { _id: '$product._id', product: { $first: '$product' } } },

      { $limit: 7 },

      { $project: { categoryDoc: 0 } },
    ])

    const formattedProducts: IProduct[] = aggregatedProducts.map(
      ({ product }: { product: IProductLocal & { categorySlug?: string } }) => {
        const transformedImage = cloudinary.url(`${product.images}`, {
          transformation: [
            { width: 500, crop: 'scale' },
            { quality: 35 },
            { fetch_format: 'auto' },
          ],
        })

        return {
          ...product,
          _id: product._id?.toString(),
          name: product.name[locale],
          description: product.description[locale],
          categories: product.categories ?? [],
          category: product.categorySlug ?? '',
          menu: product.menu[locale],
          composition: product.composition[locale],
          variables: JSON.parse(JSON.stringify(product.variables)),
          statusLabel: product.statusLabel,
          nutritionalValue: product.nutritionalValue,
          title: product.title[locale],
          metaDescription: product.metaDescription[locale],
          keywords: product.keywords[locale],
          images: [transformedImage],
        }
      },
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
    return { success: false, data: [], message: `${error}` }
  }
}
