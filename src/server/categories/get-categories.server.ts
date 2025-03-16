'use server'
import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'
import { Product } from '@/server/products/productSchema'

export async function getCategories(slug?: string, locale?: ILocale) {
  'use server'
  try {
    await connectToDb()

    if (slug && (slug === 'promotions' || slug === 'mixes')) {
      const mainCategory = await Category.findOne({ slug }).lean<ICategory>()

      if (!mainCategory) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        }
      }

      const products = await Product.find({
        categories: mainCategory._id,
      }).lean()

      const categoryIdsSet = new Set<string>()

      products.forEach((product) => {
        product.categories.forEach((catId: string) => {
          categoryIdsSet.add(String(catId))
        })
      })

      const categories = await Category.find({
        _id: { $in: Array.from(categoryIdsSet) },
      })
        .sort({ order: 1 })
        .populate({
          path: 'children',
          populate: {
            path: 'children',
          },
        })
        .lean()

      return {
        data: categories,
        success: true,
        message: 'Categories retrieved successfully for promotions/mixes',
      }
    }

    if (slug) {
      const category = await Category.findOne({ slug })
        .sort({ order: 1 })
        .populate({
          path: 'children',
          populate: {
            path: 'children',
          },
        })
        .lean<ICategory>()

      if (!category) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        }
      }

      return {
        name: locale ? category.name?.[locale] : '',
        data: category.children || [],
        success: true,
        message: 'Category children retrieved successfully',
      }
    }

    const categories = await Category.find({ parentCategory: null })
      .sort({ order: 1 })
      .populate({
        path: 'children',
        populate: {
          path: 'children',
        },
      })
      .lean()

    const plainCategories = JSON.parse(JSON.stringify(categories))

    return {
      data: plainCategories,
      success: true,
      message: 'Categories retrieved successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve categories: ${error}`,
    }
  }
}

/*

export async function getCategories(slug?: string, locale?: ILocale) {
  'use server'
  try {
    await connectToDb()

    // Якщо slug є "promotions" або "mixes", використовуємо логіку пошуку через товари
    if (slug && (slug === 'promotions' || slug === 'mixes')) {
      // Знаходимо категорію за slug (головна категорія)
      const mainCategory = await Category.findOne({ slug }).lean()
      if (!mainCategory) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        }
      }

      // Знаходимо товари, які мають зв’язок з цією категорією
      const products = await Product.find({
        categories: mainCategory._id,
      }).lean()

      // Збираємо усі унікальні категорії з цих товарів
      const categoryIdsSet = new Set<string>()
      products.forEach((product) => {
        product.categories.forEach((catId: any) => {
          categoryIdsSet.add(String(catId))
        })
      })

      // Шукаємо всі категорії за зібраними id
      const categories = await Category.find({
        _id: { $in: Array.from(categoryIdsSet) },
      })
        .sort({ order: 1 })
        .populate({
          path: 'children',
          populate: {
            path: 'children',
          },
        })
        .lean()

      return {
        data: categories,
        success: true,
        message: 'Categories retrieved successfully for promotions/mixes',
      }
    }

    // Якщо slug вказаний, але не є promotions або mixes, застосовуємо початкову логіку
    if (slug) {
      const category = await Category.findOne({ slug })
        .sort({ order: 1 })
        .populate({
          path: 'children',
          populate: {
            path: 'children',
          },
        })
        .lean<ICategory>()

      if (!category) {
        return {
          data: [],
          success: false,
          message: `Category with slug ${slug} not found`,
        }
      }

      return {
        name: locale ? category.name?.[locale] : '',
        data: category.children || [],
        success: true,
        message: 'Category children retrieved successfully',
      }
    }

    // Якщо slug не переданий, повертаємо всі головні категорії
    const categories = await Category.find({ parentCategory: null })
      .sort({ order: 1 })
      .populate({
        path: 'children',
        populate: {
          path: 'children',
        },
      })
      .lean()

    const plainCategories = JSON.parse(JSON.stringify(categories))

    return {
      data: plainCategories,
      success: true,
      message: 'Categories retrieved successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't retrieve categories: ${error}`,
    }
  }
}
 */
