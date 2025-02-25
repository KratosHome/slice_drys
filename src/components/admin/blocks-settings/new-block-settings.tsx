'use client'

import { useState } from 'react'
import { Input } from '@/components/admin/ui/input'
import { Select } from '@/components/admin/ui/select'
import { Button } from '@/components/admin/ui/button'
import { createBlockSettings } from '@/server/blocks/create-block-settings.server'
import { INewBlockSettingsProps, IBlockField } from '@/types/IBlockSettings'
import { convertCamelCase } from '@/hooks/convertStringHelper'

export const NewBlockSettings = ({ locale = 'uk' }: INewBlockSettingsProps) => {
  const [blockFields, setBlockFields] = useState<{
    name: string
    fields: IBlockField[]
  }>({ name: '', fields: [] })

  const [message, setMessage] = useState('')

  const handleAddField = () => {
    setBlockFields((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        { fieldName: '', widgetType: 'textfield' } as IBlockField,
      ],
    }))
  }

  const handleFieldChange = (index: number, key: string, value: string) => {
    const fields = blockFields.fields.map((field, i) =>
      index === i ? { ...field, [key]: value } : field,
    )

    setBlockFields({ ...blockFields, fields: fields })
  }

  const handleRemoveField = (index: number) => {
    setBlockFields((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }))
  }

  const handleAddBlockSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!blockFields.name.trim() || blockFields.fields.length === 0) {
      setMessage(
        locale === 'uk' ? 'Всі поля обов’язкові' : 'All fields are required',
      )
      return
    }

    const fields = blockFields.fields.reduce<
      Record<string, { type: string; value: string | string[] | null }>
    >((acc, value) => {
      const fieldName = convertCamelCase(value.fieldName)
      const widgetType = value.widgetType

      acc[fieldName] = {
        type: widgetType,
        value: null,
      }

      return acc
    }, {})

    const block = {
      _id: blockFields.name.toLowerCase().replace(/ /g, '_'),
      name: blockFields.name,
      settings: {
        uk: fields,
        en: fields,
      },
    }

    createBlockSettings(block)
      .then((res) => {
        setMessage(res.message)
        setBlockFields({ name: '', fields: [] })
      })
      .catch((err) => setMessage(err.message))
  }

  return (
    <div className="mb-3 rounded-sm border p-3">
      <h6 className="block-title">
        {locale == 'uk'
          ? 'Додати нові налаштування блоку'
          : 'Add new block settings'}
      </h6>
      <form
        onSubmit={handleAddBlockSettingsSubmit}
        className="flex flex-col gap-3"
      >
        <Input
          placeholder='Block ID like "Help"'
          value={blockFields.name}
          onChange={(e) =>
            setBlockFields({ ...blockFields, name: e.target.value })
          }
        />

        <div className="flex flex-col gap-2">
          {blockFields.fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Field machine name ( e.g. subTitle)"
                value={field.fieldName}
                onChange={(e) =>
                  handleFieldChange(index, 'fieldName', e.target.value)
                }
              />
              <Select
                value={field.widgetType}
                onChange={(e) =>
                  handleFieldChange(index, 'widgetType', e.target.value)
                }
                options={[
                  { value: 'textfield', label: 'TextField' },
                  { value: 'textarea', label: 'Textarea' },
                  { value: 'images', label: 'Images' },
                  { value: 'faq', label: 'FAQ' },
                ]}
              />
              <Button onClick={() => handleRemoveField(index)} type="button">
                X
              </Button>
            </div>
          ))}
          <Button onClick={handleAddField} type="button" className="max-w-sm">
            {locale == 'uk' ? 'Додати поле' : 'Add Field'}
          </Button>
        </div>

        <Button type="submit" className="max-w-sm">
          {locale == 'uk'
            ? 'Додати нові налаштування блоку'
            : 'Add new block settings'}
        </Button>
        {message && <p className="text-green-500">{message}</p>}
      </form>
    </div>
  )
}
