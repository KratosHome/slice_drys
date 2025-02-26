'use server'
import { connectToDb } from '@/server/connectToDb'
import { Menu } from '@/server/menu/menu-schema'

interface IMenuData {
  name: {
    en: string
    uk: string
  }
  slug: string
  categories: string[]
}

export async function createMenu(data: IMenuData) {
  'use server'
  try {
    await connectToDb()

    const menu = new Menu(data)
    await menu.save()

    return { success: true, message: 'Menu created' }
  } catch (error) {
    return { success: false, message: `Can't create menu ${error}` }
  }
}
