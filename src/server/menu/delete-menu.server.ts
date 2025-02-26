'use server'
import { connectToDb } from '@/server/connectToDb'
import { Menu } from '@/server/menu/menu-schema'

export async function deleteMenu(id: string) {
  'use server'
  try {
    await connectToDb()

    const deletedMenu = await Menu.findByIdAndDelete(id)

    if (!deletedMenu) {
      return { success: false, message: 'Menu not found' }
    }

    return { success: true, message: 'Menu deleted' }
  } catch (error) {
    return { success: false, message: `Can't delete menu ${error}` }
  }
}
