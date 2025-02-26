'use server'
import { connectToDb } from '@/server/connectToDb'
import { Menu } from '@/server/menu/menu-schema'
import { Category } from '@/server/categories/categories-schema'

interface IMenuUpdateData {
  id: string
  name?: {
    en?: string
    uk?: string
  }
  slug?: string
  categories?: string[]
}

export async function updateMenu(data: IMenuUpdateData) {
  'use server'
  try {
    await connectToDb()

    const updatedMenu = await Menu.findByIdAndUpdate(data.id, data, {
      new: true,
    })

    if (!updatedMenu) {
      return { success: false, message: 'Menu not found' }
    }

    /*
// Видаляємо меню з категорій, які більше не мають до нього належати
    await Category.updateMany(
      { menu: data.id, _id: { $nin: data.categories || [] } },
      { $unset: { menu: '' } },
    )

 */
    await Category.updateMany(
      { _id: { $in: data.categories } },
      { menu: data.id },
    )

    if (!updatedMenu) {
      return { success: false, message: 'Menu not found' }
    }

    return { success: true, message: 'Menu updated', menu: updatedMenu }
  } catch (error) {
    return { success: false, message: `Can't update menu ${error}` }
  }
}
