'use server'
import cloudinary from '../cloudinary-config.server'
import { connectToDbServer } from '../connect-to-db.server'
import { Product } from './product-schema.server'

export async function getProductBySlug({
  slug,
  locale,
}: {
  slug: string
  locale: ILocale
}) {
  'use server'
  try {
    await connectToDbServer()

    const product = await Product.findOne(
      { slug: slug.toLowerCase() },
      {
        [`name.${locale}`]: 1,
        [`description.${locale}`]: 1,
        [`menu.${locale}`]: 1,
        [`composition.${locale}`]: 1,
        img: 1,
        variables: 1,
        nutritionalValue: 1,
        statusLabel: 1,
        visited: 1,
        categories: 1,
        title: 1,
        metaDescription: 1,
        keywords: 1,
        slug: 1,
      },
    ).populate(
      'categories',
      'name description metaTitle metaDescription metaKeywords slug children parentCategory',
    )

    if (!product) {
      return {
        data: [],
        success: false,
        message: 'Product not found',
      }
    }

    const transformedImg = cloudinary.url(`${product.img}`, {
      transformation: [
        { width: 500, crop: 'scale' },
        { quality: 35 },
        { fetch_format: 'auto' },
      ],
    })

    const categories = product.categories.map((category: ICategory) => ({
      _id: category._id?.toString(),
      name: category.name?.[locale],
      description: category.description?.[locale],
      metaTitle: category.metaTitle?.[locale],
      metaDescription: category.metaDescription?.[locale],
      metaKeywords: category.metaKeywords?.[locale],
      slug: category.slug,
      children: category.children,
      parentCategory: category.parentCategory?.toString() ?? null,
    }))

    const data = {
      _id: product._id?.toString(),
      title: product.title[locale],
      metaDescription: product.metaDescription[locale],
      keywords: product.keywords[locale],
      name: product.name[locale],
      description: product.description?.[locale],
      menu: product.menu?.[locale],
      composition: product.composition?.[locale],
      img: transformedImg,
      variables: JSON.parse(JSON.stringify(product.variables)),
      nutritionalValue: JSON.parse(JSON.stringify(product.nutritionalValue)),
      statusLabel: product.statusLabel,
      visited: product.visited,
      slug: product.slug,
      categories,
    }

    return {
      data: JSON.parse(JSON.stringify(data)) as typeof data,
      success: true,
      message: 'Product retrieved successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve product: ${error}`,
    }
  }
}
