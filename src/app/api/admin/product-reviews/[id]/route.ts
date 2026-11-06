import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import {
  deleteProductReview,
  moderateProductReview,
} from '@/server/reviews/product-reviews.server'
import {
  readReviewJson,
  requireReviewOrigin,
} from '@/server/reviews/review-request.server'

export const dynamic = 'force-dynamic'
type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Context) {
  try {
    requireReviewOrigin(request)
    const { id } = await params
    const body = await readReviewJson(request)
    await moderateProductReview(id, body.status)
    return noStoreJson({ success: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    requireReviewOrigin(request)
    const { id } = await params
    await deleteProductReview(id)
    return noStoreJson({ success: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
