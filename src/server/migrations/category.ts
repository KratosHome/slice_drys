import { connectToDb } from '@/server/connectToDb'
import { Category } from '@/server/categories/categories-schema'
import { Menu } from '@/server/menu/menu-schema'

export const seedCategories = async () => {
  try {
    await connectToDb()

    const count = await Category.countDocuments()

    if (count === 0) {
      const menus = await Menu.find()

      if (menus.length === 0) {
        return {
          success: false,
          message: 'No menus found. Please seed menus first.',
        }
      }

      const categoriesData = [
        {
          name: { en: 'Beef', uk: 'Яловичина' },
          slug: 'beef',
          description: { en: 'Beef products', uk: 'Продукти з яловичини' },
          metaTitle: { en: 'Beef', uk: 'Яловичина' },
          metaDescription: { en: 'All about beef', uk: 'Все про яловичину' },
          metaKeywords: { en: 'beef, meat', uk: 'яловичина, м’ясо' },
          menu: menus.find((m) => m.name.en === 'Meat')?._id,
        },
        {
          name: { en: 'Pork', uk: 'Свинина' },
          slug: 'pork',
          description: { en: 'Pork products', uk: 'Продукти зі свинини' },
          metaTitle: { en: 'Pork', uk: 'Свинина' },
          metaDescription: { en: 'All about pork', uk: 'Все про свинину' },
          metaKeywords: { en: 'pork, meat', uk: 'свинина, м’ясо' },
          menu: menus.find((m) => m.name.en === 'Meat')?._id,
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
          menu: menus.find((m) => m.name.en === 'Fruits')?._id,
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
          menu: menus.find((m) => m.name.en === 'Vegetables')?._id,
        },
      ]

      const createdCategories = await Category.create(categoriesData)

      await Promise.all(
        createdCategories.map(async (cat) => {
          if (cat.menu) {
            await Menu.findByIdAndUpdate(
              cat.menu,
              { $push: { categories: cat._id } },
              { new: true },
            )
          }
        }),
      )
    }

    return {
      success: true,
      message: 'Categories seeded successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: `${error}`,
    }
  }
}
