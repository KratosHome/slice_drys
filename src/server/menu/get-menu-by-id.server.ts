'use server'
import { connectToDb } from '@/server/connectToDb'
import { Menu } from '@/server/menu/menu-schema'

export async function getMenuById(menuId: string) {
  'use server'
  try {
    await connectToDb()

    const menu = await Menu.findById(menuId).populate('categories')

    return { data: menu, success: true, message: 'Product created' }
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` }
  }
}
