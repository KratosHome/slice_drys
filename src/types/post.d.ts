interface IPost {
  _id?: string
  title: string
  content: string
  img: string
  author: string
  slug: string
  metaDescription: string
  keywords: string
  visited?: number
  updatedAt: Date
}

interface IPostLocal {
  _id?: string
  title: ILocalizedString
  content: ILocalizedString
  img: string
  author: ILocalizedString
  slug: string
  metaDescription: ILocalizedString
  keywords: ILocalizedString
  visited?: number
}

interface IGetPost {
  post: IPost[]
  postAll?: IPostLocal[]
  success: boolean
  message: string
}

interface IGetOnePost {
  post: IPost
  success: boolean
  message: string
}
