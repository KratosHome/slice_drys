'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'

export async function findProductInfoItems() {
  'use server'
  try {
    await connectToDbServer()

    const uniqueCompositionsEn: string[] =
      await Product.distinct('composition.en')
    const uniqueCompositionsUk: string[] =
      await Product.distinct('composition.uk')

    const uniqueMenusEn: string[] = await Product.distinct('menu.en')
    const uniqueMenusUk: string[] = await Product.distinct('menu.uk')

    const uniqueCategoriesEn: string[] = await Product.distinct('category.en')
    const uniqueCategoriesUk: string[] = await Product.distinct('category.uk')

    const proteins: string[] = await Product.distinct(
      'nutritionalValue.proteins',
    )
    const fats: string[] = await Product.distinct('nutritionalValue.fats')
    const carbohydrates: string[] = await Product.distinct(
      'nutritionalValue.carbohydrates',
    )
    const energyValue: string[] = await Product.distinct(
      'nutritionalValue.energyValue',
    )

    const currency: string[] = await Product.distinct('currency')

    const weight: string[] = await Product.distinct('weight')

    return {
      success: true,
      composition: {
        en: uniqueCompositionsEn,
        uk: uniqueCompositionsUk,
      },
      menu: {
        en: uniqueMenusEn,
        uk: uniqueMenusUk,
      },
      category: {
        en: uniqueCategoriesEn,
        uk: uniqueCategoriesUk,
      },
      currency,
      weight,
      proteins,
      fats,
      carbohydrates,
      energyValue,
      message: 'Product created',
    }
  } catch (error) {
    return {
      success: false,
      composition: {
        en: [],
        uk: [],
      },
      menu: {
        en: [],
        uk: [],
      },
      category: {
        en: [],
        uk: [],
      },
      currency: [],
      weight: [],
      proteins: [],
      fats: [],
      carbohydrates: [],
      energyValue: [],
      message: `Can't create product ${error}`,
    }
  }
}
