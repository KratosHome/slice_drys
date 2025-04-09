interface IReview {
  _id: number
  author: Record<ILocale, string>
  text: Record<ILocale, string>
  rating: number
  updatedAt: Date
  createdAt: Date
}
interface IReviewLocal {
  _id: number
  author: string
  text: string
  rating: number
  updatedAt: Date
  createdAt: Date
}
