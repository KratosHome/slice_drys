interface ICategory {
  _id: string
  name: ILocalizedString
  h1: ILocalizedString
  slug: string
  description?: ILocalizedString
  metaTitle?: ILocalizedString
  metaDescription?: ILocalizedString
  metaKeywords?: ILocalizedString
  image?: string
  children: ICategory[]
  parentCategory?: string | null
  order: number
}

interface IPublicCategoryLink {
  slug: string
  name: ILocalizedString
}

type CategorySlug = Pick<ICategory, '_id' | 'slug' | 'parentCategory'>

type CategorySeed = Omit<ICategory, '_id' | 'children'>
