import type {
  ProductReview,
  ProductReviewReply,
  ProductReviewsData,
  ReviewPhoto,
  ReviewStatus,
} from '@/types/product-review'

export interface StoredReview {
  _id: { toString(): string } | string
  productId: { toString(): string } | string
  parentId: { toString(): string } | string | null
  author: string
  text: string
  rating?: number
  photos: ReviewPhoto[]
  status: ReviewStatus
  isStoreRepresentative: boolean
  createdAt: Date | string
}

export function serializeReviewReply(review: StoredReview): ProductReviewReply {
  return {
    id: String(review._id),
    author: review.author,
    text: review.text,
    createdAt: new Date(review.createdAt).toISOString(),
    isStoreRepresentative: review.isStoreRepresentative === true,
  }
}

export function serializeReviewPhotos(review: StoredReview): ReviewPhoto[] {
  return (review.photos ?? []).map((_, index) => ({
    publicId: `${String(review._id)}-${index}`,
    url: `/api/product-review-photos/${String(review._id)}/${index}`,
  }))
}

export function serializePublicReviews(
  productId: string,
  rows: StoredReview[],
): ProductReviewsData {
  const roots = rows.filter(
    (row) =>
      String(row.productId) === productId &&
      !row.parentId &&
      row.status === 'approved' &&
      Number.isInteger(row.rating) &&
      row.rating! >= 1 &&
      row.rating! <= 5,
  )
  const reviews: ProductReview[] = roots.map((row) => ({
    ...serializeReviewReply(row),
    rating: row.rating!,
    photos: serializeReviewPhotos(row),
    replies: rows
      .filter(
        (reply) =>
          String(reply.productId) === productId &&
          String(reply.parentId) === String(row._id) &&
          reply.status === 'approved',
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map(serializeReviewReply),
  }))
  return {
    productId,
    reviews,
    ratingCount: reviews.length,
    averageRating: reviews.length
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length) *
            10,
        ) / 10
      : null,
  }
}
