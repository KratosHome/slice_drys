'use server'
import { connectToDb } from '@/server/connectToDb'
import Block from '@/server/block/blocks-schema'

export async function getHelpMain(locale: ILocale, isLocal: boolean) {
  'use server'
  try {
    await connectToDb()

    const block = await Block.findOne().select('help').lean<{ help: IHelp }>()

    if (!block || !block.help) {
      return {
        success: false,
        message: 'Дані блоку допомоги не знайдено',
      }
    }

    const dataLocale = {
      title: block.help.title[locale],
      content: block.help.content[locale],
      button: block.help.button[locale],
      link: block.help.link,
      images: block.help.images,
    }

    return {
      success: true,
      data: isLocal ? dataLocale : block.help,
    }
  } catch (error) {
    return {
      data: undefined,
      success: false,
      message: `Помилка: ${error}`,
    }
  }
}
