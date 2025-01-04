interface IPostLocal {
  _id?: string
  title?: ILocalizedString
  content?: ILocalizedString
  img?: string
  author?: string
  date?: Date
  slug?: string
  metaDescription?: string
  keywords?: string[]
  readingTime?: number
}
