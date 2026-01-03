'use server'

import { Category } from '@/server/categories/categories-schema.server'

import { connectToDbServer } from '@/server/connect-to-db.server'

export const seedCategories = async (): Promise<IResponse> => {
  try {
    await connectToDbServer()

    const count: number = await Category.countDocuments()

    if (count !== 0) {
      return {
        success: false,
        message: 'Categories already exist. No changes were made.',
      }
    }

    const categoriesData: CategorySeed[] = [
      {
        name: { en: 'Meat', uk: 'М’ясо' },
        slug: 'meat',
        h1: { en: 'Meat Products', uk: 'М’ясні продукти' },
        description: { en: 'All types of meat', uk: 'Всі види м’яса' },
        metaTitle: { en: 'Meat', uk: 'М’ясо' },
        metaDescription: { en: 'Everything about meat', uk: 'Все про м’ясо' },
        metaKeywords: {
          en: 'meat, beef, pork',
          uk: 'м’ясо, яловичина, свинина',
        },
        order: 0,
      },
      {
        name: { en: 'Vegetables', uk: 'Овочі' },
        h1: { en: 'Vegetable Products', uk: 'Овочеві продукти' },
        slug: 'vegetables',
        description: { en: 'All types of vegetables', uk: 'Всі види овочів' },
        metaTitle: { en: 'Vegetables', uk: 'Овочі' },
        metaDescription: {
          en: 'Everything about vegetables',
          uk: 'Все про овочі',
        },
        metaKeywords: {
          en: 'vegetables, pumpkin, carrot',
          uk: 'овочі, гарбуз, морква',
        },
        order: 1,
      },
      {
        name: { en: 'Fruits', uk: 'Фрукти' },
        slug: 'fruits',
        h1: { en: 'Fruit Products', uk: 'Фруктові продукти' },
        description: { en: 'All types of fruits', uk: 'Всі види фруктів' },
        metaTitle: { en: 'Fruits', uk: 'Фрукти' },
        metaDescription: {
          en: 'Everything about fruits',
          uk: 'Все про фрукти',
        },
        metaKeywords: {
          en: 'fruits, apple, pineapple',
          uk: 'фрукти, яблуко, ананас',
        },
        order: 2,
      },
      {
        name: { en: 'Mixes', uk: 'Мікси' },
        slug: 'mixes',
        h1: { en: 'Mixed Products', uk: 'Міксовані продукти' },
        description: {
          en: 'Various mixed products',
          uk: 'Різні мікси продуктів',
        },
        metaTitle: { en: 'Mixes', uk: 'Мікси' },
        metaDescription: {
          en: 'Different types of food mixes',
          uk: 'Різні види харчових міксів',
        },
        metaKeywords: { en: 'mixes, food', uk: 'мікси, їжа' },
        order: 3,
      },
      {
        name: { en: 'Promotions', uk: 'Акції' },
        slug: 'promotions',
        h1: { en: 'Special Promotions', uk: 'Спеціальні акції' },
        description: {
          en: 'Special promotions and discounts',
          uk: 'Спеціальні акції та знижки',
        },
        metaTitle: { en: 'Promotions', uk: 'Акції' },
        metaDescription: {
          en: 'Best promotions available',
          uk: 'Найкращі доступні акції',
        },
        metaKeywords: { en: 'promotions, discounts', uk: 'акції, знижки' },
        order: 4,
      },
    ]

    const createdCategories = await Category.create(categoriesData)

    const subCategoriesData = [
      {
        name: { en: 'Chicken', uk: 'Курка' },
        slug: 'chicken',
        parentCategory: 'meat',
      },
      {
        name: { en: 'Pork', uk: 'Свинина' },
        slug: 'pork',
        parentCategory: 'meat',
      },
      {
        name: { en: 'Beef', uk: 'Яловичина' },
        slug: 'beef',
        parentCategory: 'meat',
      },
      {
        name: { en: 'Turkey', uk: 'Індичка' },
        slug: 'turkey',
        parentCategory: 'meat',
      },
      {
        name: { en: 'Pumpkin', uk: 'Гарбуз' },
        slug: 'pumpkin',
        parentCategory: 'vegetables',
      },
      {
        name: { en: 'Carrot', uk: 'Морква' },
        slug: 'carrot',
        parentCategory: 'vegetables',
      },
      {
        name: { en: 'Beetroot', uk: 'Буряк' },
        slug: 'beetroot',
        parentCategory: 'vegetables',
      },
      {
        name: { en: 'Tomato', uk: 'Помідор' },
        slug: 'tomato',
        parentCategory: 'vegetables',
      },
      {
        name: { en: 'Apple', uk: 'Яблуко' },
        slug: 'apple',
        parentCategory: 'fruits',
      },
      {
        name: { en: 'Pineapple', uk: 'Ананас' },
        slug: 'pineapple',
        parentCategory: 'fruits',
      },
      {
        name: { en: 'Strawberry', uk: 'Полуниця' },
        slug: 'strawberry',
        parentCategory: 'fruits',
      },
      {
        name: { en: 'Plum', uk: 'Слива' },
        slug: 'plum',
        parentCategory: 'fruits',
      },
    ].map((sub) => ({
      ...sub,
      description: {
        en: `All about ${sub.name.en}`,
        uk: `Все про ${sub.name.uk}`,
      },
      metaTitle: sub.name,
      metaDescription: {
        en: `Learn about ${sub.name.en}`,
        uk: `Дізнайтесь про ${sub.name.uk}`,
      },
      metaKeywords: {
        en: `${sub.name.en.toLowerCase()}, ${sub.parentCategory}`,
        uk: `${sub.name.uk.toLowerCase()}, ${sub.parentCategory}`,
      },
      parentCategory: createdCategories.find(
        (cat) => cat.slug === sub.parentCategory,
      )?._id,
    }))

    const createdSubCategories = await Category.create(subCategoriesData)

    await Promise.all(
      createdSubCategories.map(async (subCategory) => {
        if (subCategory.parentCategory) {
          await Category.findByIdAndUpdate(
            subCategory.parentCategory,
            { $push: { children: subCategory._id } },
            { new: true },
          )
        }
      }),
    )

    return {
      success: true,
      message: 'Categories and subcategories seeded successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error}`,
    }
  }
}
