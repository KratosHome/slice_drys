export interface IBlockSettings {
  _id: string
  name: string
  settings: {
    uk: Record<string, IBlockFieldSettings>
    en: Record<string, IBlockFieldSettings>
  }
}

export interface IBlockFieldSettings {
  type: 'textfield' | 'textarea' | 'images'
  value: string | string[] | null
}

export interface INewBlockSettingsProps {
  locale: string | undefined
}

interface IBlockField {
  fieldName: string
  widgetType: string
}
