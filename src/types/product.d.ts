interface IProduct {
  _id?: string
  name: string
  description: string
  img?: string
  variables: IVariableProduct[]
  menu: string[]
  slug: string
  composition: string[]
  statusLabel: string[]
  visited?: number
  categories: string[]
  nutritionalValue: INutritionalValue
  variant?: IVariableProduct
  title: string
  metaDescription: string
  keywords: string[]
  images: string[]
}

interface IProductLocal {
  _id?: string
  name: ILocalizedString
  description: ILocalizedString
  img?: string
  variables: IVariableProduct[]
  menu: ILocalizedStringArray
  composition: ILocalizedStringArray
  statusLabel: string[]
  visited?: number
  slug: string
  categories: string[]
  nutritionalValue: INutritionalValue
  title: ILocalizedString
  metaDescription: ILocalizedString
  keywords: ILocalizedStringArray
  images: string[]
}

interface INutritionalValue {
  proteins: string
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
  composition: ILocalizedStringArray
  menu: ILocalizedStringArray
  category: ILocalizedStringArray
  currency: string[]
  weight: string[]
  proteins: string[]
  fats: string[]
  carbohydrates: string[]
  energyValue: string[]
  message: string
}

interface IGetProduct {
  product: IProduct[]
  productAll?: IProductLocal[]
  success: boolean
  message: string
}

interface IGetProducts {
  products: IProduct[]
  success: boolean
  message: string
}
