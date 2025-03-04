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
  createdAt: Date
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
  updatedAt: Date
  createdAt: Date
}

interface IGetPostsAdmin {
  postsLocalized: IPost[]
  postsAll?: IPostLocal[]
  success: boolean
  message: string
}
interface IGetPostsClient {
  postsLocalized: IPost[]
  postsAll?: IPostLocal[]
  currentPage: number
  totalPages: number
  totalPosts: number
  success: boolean
  message: string
}

interface IGetLocalizedPost {
  post: IPost
  success: boolean
  message: string
}
