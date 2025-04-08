interface IReview {
  _id?: string
  author: Record<ILocale, string>
  text: Record<ILocale, string>
  rating: number
  updatedAt: Date
  createdAt: Date
}
interface IReviewLocal {
  _id?: string
  author: string
  text: string
  rating: number
  updatedAt: Date
  createdAt: Date
}
