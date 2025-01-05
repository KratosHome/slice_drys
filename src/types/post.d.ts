interface IPostLocal {
  _id?: string
  title: ILocalizedString
  content: ILocalizedString
  img: string
  author: ILocalizedString
  date: Date
  slug: string
  metaDescription: ILocalizedString
  keywords: ILocalizedStringArray
  readingTime: number
}
