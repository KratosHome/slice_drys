'use server'

import { connectToDb } from '@/server/connectToDb'
import { Block } from '@/server/blocks/blockSchema'
import { IBlockSettings } from '@/types/IBlockSettings'

export async function createBlockSettings(blockSettings: IBlockSettings) {
  'use server'
  try {
    await connectToDb()

    console.log('blockSettings 13', blockSettings)

    const block = new Block(blockSettings)
    await block.save()

    return {
      success: true,
      message: `Settings for ${blockSettings.name} was added`,
    }
  } catch (error) {
    return { success: false, message: `Can't create block settings: ${error}` }
  }
}
