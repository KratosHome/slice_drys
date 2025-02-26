import { connectToDb } from '@/server/connectToDb'
import { Menu } from '@/server/menu/menu-schema'
import { seedCategories } from '@/server/migrations/category'

export const seedMenus = async () => {
  try {
    await connectToDb()

    const count = await Menu.countDocuments()

    if (count === 0) {
      await Menu.create([
        {
          name: { en: 'Meat', uk: 'М’ясо' },
          slug: 'meat',
          categories: [],
        },
        {
          name: { en: 'Fruits', uk: 'Фрукти' },
          slug: 'fruits',
          categories: [],
        },
        {
          name: { en: 'Vegetables', uk: 'Овочі' },
          slug: 'vegetables',
          categories: [],
        },
        {
          name: { en: 'Mixes', uk: 'Мікси' },
          slug: 'mixes',
          categories: [],
        },
      ])
    }

    await seedCategories()

    return {
      success: true,
      message: 'Menus seeded successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: `${error}`,
    }
  }
}
