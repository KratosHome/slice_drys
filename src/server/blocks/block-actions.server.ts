'use server'

import { Block } from '@/server/blocks/blockSchema'

export async function getAllBlocks() {
  'use server'
  const blocks = await Block.find({}).lean()
  return blocks
}

export async function updateBlockSettings(
  blockId: string,
  settings: { uk: Record<string, unknown>; en: Record<string, unknown> },
) {
  'use server'

  try {
    await Block.findByIdAndUpdate(blockId, { settings })

    return { success: true, message: 'Settings updated successfully!' }
  } catch (error) {
    return { success: false, message: `Error updating settings: ${error}` }
  }
}

export async function getBlockSettings(blockId: string) {
  'use server'
  try {
    const block = await Block.findById(blockId).lean()
    return block && !Array.isArray(block) ? block.settings : null
  } catch (error) {
    console.error('Error fetching block settings:', error)
    return null
  }
}