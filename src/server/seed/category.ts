import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'

export const seedCategories = async () => {
  try {
    await connectToDb()

    const count = await Category.countDocuments()

    if (count === 0) {
      const categoriesData = [
        {
          name: { en: 'Meat', uk: 'М’ясо' },
          slug: 'meat',
          description: { en: 'All types of meat', uk: 'Всі види м’яса' },
          metaTitle: { en: 'Meat', uk: 'М’ясо' },
          metaDescription: { en: 'Everything about meat', uk: 'Все про м’ясо' },
          metaKeywords: {
            en: 'meat, beef, pork',
            uk: 'м’ясо, яловичина, свинина',
          },
        },
        {
          name: { en: 'Fruits', uk: 'Фрукти' },
          slug: 'fruits',
          description: { en: 'All types of fruits', uk: 'Всі види фруктів' },
          metaTitle: { en: 'Fruits', uk: 'Фрукти' },
          metaDescription: {
            en: 'Everything about fruits',
            uk: 'Все про фрукти',
          },
          metaKeywords: { en: 'fruits, apples', uk: 'фрукти, яблука' },
        },
        {
          name: { en: 'Vegetables', uk: 'Овочі' },
          slug: 'vegetables',
          description: { en: 'All types of vegetables', uk: 'Всі види овочів' },
          metaTitle: { en: 'Vegetables', uk: 'Овочі' },
          metaDescription: {
            en: 'Everything about vegetables',
            uk: 'Все про овочі',
          },
          metaKeywords: { en: 'vegetables, tomatoes', uk: 'овочі, помідори' },
        },
      ]

      const createdCategories = await Category.create(categoriesData)

      const subCategoriesData = [
        {
          name: { en: 'Beef', uk: 'Яловичина' },
          slug: 'beef',
          description: { en: 'Beef products', uk: 'Продукти з яловичини' },
          metaTitle: { en: 'Beef', uk: 'Яловичина' },
          metaDescription: { en: 'All about beef', uk: 'Все про яловичину' },
          metaKeywords: { en: 'beef, meat', uk: 'яловичина, м’ясо' },
          parentCategory: createdCategories.find((cat) => cat.slug === 'meat')
            ?._id,
        },
        {
          name: { en: 'Pork', uk: 'Свинина' },
          slug: 'pork',
          description: { en: 'Pork products', uk: 'Продукти зі свинини' },
          metaTitle: { en: 'Pork', uk: 'Свинина' },
          metaDescription: { en: 'All about pork', uk: 'Все про свинину' },
          metaKeywords: { en: 'pork, meat', uk: 'свинина, м’ясо' },
          parentCategory: createdCategories.find((cat) => cat.slug === 'meat')
            ?._id,
        },
        {
          name: { en: 'Apples', uk: 'Яблука' },
          slug: 'apples',
          description: { en: 'Apple varieties', uk: 'Різновиди яблук' },
          metaTitle: { en: 'Apples', uk: 'Яблука' },
          metaDescription: {
            en: 'Best apple varieties',
            uk: 'Кращі сорти яблук',
          },
          metaKeywords: { en: 'apples, fruits', uk: 'яблука, фрукти' },
          parentCategory: createdCategories.find((cat) => cat.slug === 'fruits')
            ?._id,
        },
        {
          name: { en: 'Tomatoes', uk: 'Помідори' },
          slug: 'tomatoes',
          description: { en: 'Tomato varieties', uk: 'Різновиди помідорів' },
          metaTitle: { en: 'Tomatoes', uk: 'Помідори' },
          metaDescription: {
            en: 'Best tomato varieties',
            uk: 'Кращі сорти помідорів',
          },
          metaKeywords: { en: 'tomatoes, vegetables', uk: 'помідори, овочі' },
          parentCategory: createdCategories.find(
            (cat) => cat.slug === 'vegetables',
          )?._id,
        },
      ]

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
    }

    return {
      success: false,
      message: 'Categories already exist. No changes were made.',
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error}`,
    }
  }
}
