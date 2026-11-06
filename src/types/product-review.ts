export const REVIEW_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'hidden',
] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

export interface ReviewPhoto {
  publicId: string
  url: string
}

export interface ProductReviewReply {
  id: string
  author: string
  text: string
  createdAt: string
  isStoreRepresentative: boolean
}

export interface ProductReview extends ProductReviewReply {
  rating: number
  photos: ReviewPhoto[]
  replies: ProductReviewReply[]
}

export interface ProductReviewsData {
  productId: string
  reviews: ProductReview[]
  ratingCount: number
  averageRating: number | null
}

export interface AdminProductReview extends ProductReviewReply {
  productId: string
  productName: string
  productSlug: string
  parentId: string | null
  parentText: string | null
  rating: number | null
  photos: ReviewPhoto[]
  status: ReviewStatus
}

export interface AdminProductReviewsData {
  items: AdminProductReview[]
  total: number
  page: number
  pageSize: number
}
