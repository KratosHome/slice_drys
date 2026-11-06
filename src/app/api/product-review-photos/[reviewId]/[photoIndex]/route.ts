import { ApiError } from '@/server/api-error.server'
import { apiErrorResponse } from '@/server/api-response.server'
import { requirePermission } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { ProductReviewModel } from '@/server/reviews/review-schema.server'
import { reviewPhotoDeliveryUrl } from '@/server/reviews/review-photos.server'
import type { ReviewPhoto, ReviewStatus } from '@/types/product-review'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type PhotoReview = {
  parentId: unknown
  status: ReviewStatus
  photos: ReviewPhoto[]
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reviewId: string; photoIndex: string }> },
) {
  try {
    const { reviewId, photoIndex } = await params
    if (!/^[a-f\d]{24}$/i.test(reviewId) || !/^[0-2]$/.test(photoIndex)) {
      throw new ApiError(404, 'Фото не знайдено')
    }
    await connectToDbServer()
    const review = await ProductReviewModel.findById(reviewId)
      .select('parentId status photos')
      .lean<PhotoReview | null>()
    const photo = review?.photos[Number(photoIndex)]
    if (!review || review.parentId || !photo) {
      throw new ApiError(404, 'Фото не знайдено')
    }
    if (review.status !== 'approved') {
      try {
        await requirePermission('reviews:manage')
      } catch (error) {
        if (
          error instanceof ApiError &&
          [401, 403].includes(error.statusCode)
        ) {
          throw new ApiError(404, 'Фото не знайдено')
        }
        throw error
      }
    }
    // Build a signed URL from our own asset ID, never a client-supplied URL.
    const upstream = await fetch(reviewPhotoDeliveryUrl(photo.publicId), {
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    if (!upstream.ok) throw new ApiError(502, 'Не вдалося завантажити фото')
    const bytes = await upstream.arrayBuffer()
    return new Response(bytes, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'",
      },
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
