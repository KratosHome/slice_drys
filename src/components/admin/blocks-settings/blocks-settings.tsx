'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import {
  getAllBlocks,
  updateBlockSettings,
} from '@/server/blocks/block-actions.server'

interface BlocksSettingsProps {
  locale: string
}

export const BlocksSettings = ({ locale }: BlocksSettingsProps) => {
  const [blocks, setBlocks] = useState<
    {
      _id: string
      name: string
      settings: { uk: Record<string, unknown>; en: Record<string, unknown> }
    }[]
  >([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchBlocks() {
      const data = await getAllBlocks()
      setBlocks(data)
    }
    fetchBlocks()
  }, [])

  const handleBlocksSettingsSave = async (blockId: string) => {
    const blockToUpdate = blocks.find((b) => b._id === blockId)
    if (!blockToUpdate) return

    const response = await updateBlockSettings(blockId, blockToUpdate.settings)
    setMessage(response.message)
  }

  const handleInputChange = (
    blockId: string,
    lang: 'uk' | 'en',
    key: string,
    value: string,
  ) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) =>
        b._id === blockId
          ? {
              ...b,
              settings: {
                ...b.settings,
                [lang]: { ...b.settings[lang], [key]: value },
              },
            }
          : b,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-sm border p-3">
      <h6 className="block-title">
        {locale === 'uk' ? 'Налаштування блоків' : 'Blocks Settings'}
      </h6>
      {message && <p className="text-green-500">{message}</p>}
      {blocks.map((block) => (
        <div key={block._id} className="mb-6 border p-4">
          <h3 className="text-xl font-bold">{block.name}</h3>
          {['uk', 'en'].map((lang) => (
            <div key={lang} className="mt-4">
              <h6 className="mb-2 text-base font-semibold">
                {lang.toUpperCase()} version
              </h6>
              {Object.keys(block.settings[lang]).map((key) => (
                <div key={key} className="mb-2">
                  <label className="block text-sm">{key}</label>
                  <Input
                    value={block.settings[lang][key]}
                    onChange={(e) =>
                      handleInputChange(
                        block._id,
                        lang as 'uk' | 'en',
                        key,
                        e.target.value,
                      )
                    }
                    name={`${block._id}-${lang}-${key}`}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ))}
          <Button
            className="mt-3"
            onClick={() => handleBlocksSettingsSave(block._id)}
          >
            {locale === 'uk' ? 'Зберегти' : 'Save'}
          </Button>
        </div>
      ))}
    </div>
  )
}
