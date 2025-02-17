'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import {
  getAllBlocks,
  updateBlockSettings,
} from '@/server/blocks/block-actions.server'
import { camelCaseToWords } from '@/hooks/convertStringHelper'
import { IBlockSettings } from '@/types/IBlockSettings'
import { log } from 'console'

interface BlocksSettingsProps {
  locale: string
}

export const BlocksSettings = ({ locale }: BlocksSettingsProps) => {
  const [blocks, setBlocks] = useState<
    {
      _id: string
      name: string
      settings: {
        uk: { [key: string]: { type: string; value: string } }
        en: { [key: string]: { type: string; value: string } }
      }
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
    if (!blockToUpdate) {
      setMessage(`Block with ID ${blockId} not found`)
      return
    }

    const updatedSettings = { ...blockToUpdate.settings }
    Object.keys(updatedSettings).forEach((lang) => {
      Object.keys(updatedSettings[lang]).forEach((key) => {
        if (updatedSettings[lang][key]?.type === 'images') {
          const value = updatedSettings[lang][key].value

          if (Array.isArray(value) && value.length === 1) {
            updatedSettings[lang][key].value = value[0]
          }
        }
      })
    })

    const response = await updateBlockSettings(blockId, updatedSettings)
    setMessage(response.message)
  }

  const handleInputChange = (
    blockId: string,
    lang: 'uk' | 'en',
    key: string,
    value: string | string[],
  ) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => {
        if (b._id === blockId) {
          return {
            ...b,
            settings: {
              ...b.settings,
              [lang]: {
                ...b.settings[lang],
                [key]: { ...b.settings[lang][key], value: value },
              },
            },
          }
        } else {
          return b
        }
      }),
    )
  }

  const handleAddItem = (blockId: string, lang: 'uk' | 'en', key: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) =>
        b._id === blockId
          ? {
              ...b,
              settings: {
                ...b.settings,
                [lang]: {
                  ...b.settings[lang],
                  [key]: {
                    ...b.settings[lang][key],
                    value: [
                      ...(Array.isArray(b.settings[lang][key].value)
                        ? b.settings[lang][key].value
                        : []),
                      '',
                    ],
                  },
                },
              },
            }
          : b,
      ),
    )
  }

  const handleRemoveItem = (
    blockId: string,
    lang: 'uk' | 'en',
    key: string,
    index: number,
  ) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) =>
        b._id === blockId
          ? {
              ...b,
              settings: {
                ...b.settings,
                [lang]: {
                  ...b.settings[lang],
                  [key]: {
                    ...b.settings[lang][key],
                    value: (b.settings[lang][key].value as string[]).filter(
                      (_, i) => i !== index,
                    ),
                  },
                },
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
                  <label className="block text-sm">
                    {camelCaseToWords(key)}
                  </label>
                  {(() => {
                    const type = block.settings[lang][key]?.type
                    const value = block.settings[lang][key]?.value

                    switch (type) {
                      case 'textarea':
                        return (
                          <Textarea
                            value={value ?? ''}
                            onChange={(e) =>
                              handleInputChange(
                                block._id,
                                lang as 'uk' | 'en',
                                key,
                                e.target.value,
                              )
                            }
                          />
                        )
                      case 'images':
                        return (
                          <div>
                            {(Array.isArray(value) ? value : []).map(
                              (img, index) => (
                                <div
                                  key={index}
                                  className="mb-2 flex items-center gap-2"
                                >
                                  <Input
                                    value={img}
                                    placeholder="Set image local path"
                                    onChange={(e) => {
                                      const newValue = [
                                        ...(value as {
                                          title: string
                                          description: string
                                        }[]),
                                      ]
                                      newValue[index] = e.target.value
                                      handleInputChange(
                                        block._id,
                                        lang as 'uk' | 'en',
                                        key,
                                        newValue,
                                      )
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveItem(
                                        block._id,
                                        lang as 'uk' | 'en',
                                        key,
                                        index,
                                      )
                                    }
                                  >
                                    X
                                  </Button>
                                </div>
                              ),
                            )}
                            <Button
                              type="button"
                              onClick={() =>
                                handleAddItem(
                                  block._id,
                                  lang as 'uk' | 'en',
                                  key,
                                )
                              }
                            >
                              {locale === 'uk'
                                ? 'Додати зображення'
                                : 'Add Image'}
                            </Button>
                          </div>
                        )
                      case 'faq':
                        return (
                          <div>
                            {(Array.isArray(value) ? value : []).map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="mb-2 flex items-center gap-2"
                                >
                                  <Input
                                    value={item.title ?? ''}
                                    onChange={(e) => {
                                      const newValue = [
                                        ...(value as {
                                          title: string
                                          description: string
                                        }[]),
                                      ]
                                      newValue[index] = {
                                        ...(newValue[index] as {
                                          title: string
                                          description: string
                                        }),
                                        title: e.target.value,
                                      }
                                      handleInputChange(
                                        block._id,
                                        lang as 'uk' | 'en',
                                        key,
                                        newValue,
                                      )
                                    }}
                                  />
                                  <Textarea
                                    value={item.description ?? ''}
                                    onChange={(e) => {
                                      const newValue = [
                                        ...(value as {
                                          title: string
                                          description: string
                                        }[]),
                                      ]
                                      newValue[index] = {
                                        ...(newValue[index] as {
                                          title: string
                                          description: string
                                        }),
                                        description: e.target.value,
                                      }
                                      handleInputChange(
                                        block._id,
                                        lang as 'uk' | 'en',
                                        key,
                                        newValue,
                                      )
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveItem(
                                        block._id,
                                        lang as 'uk' | 'en',
                                        key,
                                        index,
                                      )
                                    }
                                  >
                                    X
                                  </Button>
                                </div>
                              ),
                            )}
                            <Button
                              type="button"
                              onClick={() =>
                                handleAddItem(
                                  block._id,
                                  lang as 'uk' | 'en',
                                  key,
                                )
                              }
                            >
                              {locale === 'uk' ? 'Додати елемент' : 'Add item'}
                            </Button>
                          </div>
                        )
                      default:
                        return (
                          <Input
                            value={value ?? ''}
                            onChange={(e) =>
                              handleInputChange(
                                block._id,
                                lang as 'uk' | 'en',
                                key,
                                e.target.value,
                              )
                            }
                          />
                        )
                    }
                  })()}
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
