import { Types } from 'mongoose'

interface ICategory {
  _id: string
  name: ILocalizedString
  slug: string
  description?: ILocalizedString
  metaTitle?: ILocalizedString
  metaDescription?: ILocalizedString
  metaKeywords?: ILocalizedString
  parentCategory?: Types.ObjectId | null
  image?: string
  menu: Types.ObjectId
}
