interface IProduct {
  _id?: string
  name: string
  description: string
  img?: string
  variables: IVariableProduct[]
  category: string[]
  menu: string[]
  composition: string[]
  statusLabel: string[]
  visited?: number
  nutritionalValue: INutritionalValue
}

interface IProductLocal {
  _id?: string
  name: ILocalizedString
  description: ILocalizedString
  img?: string
  variables: IVariableProduct[]
  category: ILocalizedStringArray
  menu: ILocalizedStringArray
  composition: ILocalizedStringArray
  statusLabel: string[]
  visited?: number
  nutritionalValue: INutritionalValue
}

interface ILocalizedString {
  en: string
  uk: string
}

interface ILocalizedStringArray {
  en: string[]
  uk: string[]
}

interface INutritionalValue {
  squirrels: string
  fats: string
  carbohydrates: string
  energyValue: string
}

interface IVariableProduct {
  _id?: number
  weight: number
  price: number
  newPrice?: number
  currency: string
  count: number
  sold?: number
}

interface IRecommendations {
  success: boolean
  composition: {
    en: string[]
    uk: string[]
  }
  menu: {
    en: string[]
    uk: string[]
  }
  category: {
    en: string[]
    uk: string[]
  }
  currency: string[]
  weight: string[]
  squirrels: string[]
  fats: string[]
  carbohydrates: string[]
  energyValue: string[]
  message: string
}

interface IGetProduct {
  product: IProduct[]
  productAll: IProductLocal[]
  success: boolean
  message: string
}
export interface IProductCard {
  _id?: IProduct['_id']
  name: IProduct['name']
  img: string
  available: boolean
  newPrice?: number[]
  price: number[]
  weight: IRecommendations['weight']
  badges: { type: string; label: string }[]
}
