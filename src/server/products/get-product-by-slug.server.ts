import cloudinary from '../cloudinaryConfig'
import { connectToDb } from '../connectToDb'
import { Product } from './productSchema'

export async function getProductBySlug({
  slug,
  locale,
}: {
  slug: string
  locale: ILocale
}) {
  'use server'
  try {
    await connectToDb()

    const product = await Product.findOne(
      { slug: { $regex: `^${slug}$`, $options: 'i' } },
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
    ).populate('categories')

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
      id: category._id,
      name: category.name?.[locale],
      description: category.description?.[locale],
      metaTitle: category.metaTitle?.[locale],
      metaDescription: category.metaDescription?.[locale],
      metaKeywords: category.metaKeywords?.[locale],
      slug: category.slug,
      children: category.children,
    }))

    const data = {
      _id: product._id,
      title: product.title[locale],
      metaDescription: product.metaDescription[locale],
      keywords: product.keywords[locale],
      name: product.name[locale],
      description: product.description?.[locale],
      menu: product.menu?.[locale],
      composition: product.composition?.[locale],
      img: transformedImg,
      variables: product.variables,
      nutritionalValue: product.nutritionalValue,
      statusLabel: product.statusLabel,
      visited: product.visited,
      slug: product.slug,
      categories,
    }

    return {
      data: data,
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
