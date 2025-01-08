interface IPostLocal {
  _id?: string
  title: ILocalizedString
  content: ILocalizedString
  img: string
  author: ILocalizedString
  slug: string
  metaDescription: ILocalizedString
  keywords: ILocalizedStringArray
  readingTime: number
}

interface IGetPost {
  product: IPostLocal[]
  productAll?: IPostLocal[]
  success: boolean
  message: string
}
