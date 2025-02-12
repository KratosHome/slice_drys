'use client'

import { useState } from 'react'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { Button } from '@/components/admin/ui/button'
import { createBlockSettings } from '@/server/blocks/create-block-settings.server'
import { NewBlockSettingsProps } from '@/types/IBlockSettings'

export const NewBlockSettings = ({ locale = 'uk' }: NewBlockSettingsProps) => {
  const [blockSettings, setBlockSettings] = useState({ name: '', settings: '' })
  const [message, setMessage] = useState('')

  const handleAddBlockSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!blockSettings.name.trim() || !blockSettings.settings.trim()) {
      setMessage(
        locale === 'uk' ? 'Всі поля обов’язкові' : 'All fields are required',
      )
      return
    }

    const fieldsArray = blockSettings.settings.split(',').map((s) => s.trim())
    const settingsObject = Object.fromEntries(
      fieldsArray.map((key) => [key, '']),
    )

    const block = {
      _id: blockSettings.name.toLowerCase().replace(/ /g, '_'),
      name: blockSettings.name,
      settings: {
        uk: settingsObject,
        en: settingsObject,
      },
    }

    createBlockSettings(block)
      .then((res) => {
        setMessage(res.message)
        setBlockSettings({ name: '', settings: '' })
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
          value={blockSettings.name}
          onChange={(e) =>
            setBlockSettings({ ...blockSettings, name: e.target.value })
          }
        />
        <Textarea
          placeholder="Add fields names like: field1, field2, field3"
          value={blockSettings.settings}
          onChange={(e) =>
            setBlockSettings({ ...blockSettings, settings: e.target.value })
          }
        />
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
