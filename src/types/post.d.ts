interface IPost {
  _id?: string
  title: string
  content: string
  img: string
  author: string
  slug: string
  metaDescription: string
  keywords: string[]
  visited?: number
}

interface IPostLocal {
  _id?: string
  title: ILocalizedString
  content: ILocalizedString
  img: string
  author: ILocalizedString
  slug: string
  metaDescription: ILocalizedString
  keywords: ILocalizedStringArray
  visited?: number
}

interface IGetPost {
  post: IPost[]
  postAll?: IPost[]
  success: boolean
  message: string
}
