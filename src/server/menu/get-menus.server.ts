'use server'
import { connectToDb } from '@/server/connectToDb'
import { Menu } from '@/server/menu/menu-schema'

export async function getMenus(locale: string) {
  'use server'
  try {
    await connectToDb()

    const menus = await Menu.find().populate('categories').lean()

    const plainMenus = JSON.parse(JSON.stringify(menus))

    return {
      data: plainMenus,
      success: true,
      message: 'Menus fetched successfully',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message: `Can't fetch menus: ${error}`,
    }
  }
}
