import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { submitProductReview } from '@/server/reviews/product-reviews.server'
import {
  limitReviewSubmission,
  readReviewForm,
  requireReviewOrigin,
} from '@/server/reviews/review-request.server'
import { parseReviewSubmission } from '@/server/reviews/review-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: Request) {
  try {
    requireReviewOrigin(request)
    const form = await readReviewForm(request)
    const input = parseReviewSubmission(form)
    // Upload-session creation already consumed the spam allowance. A staged
    // submission must claim that product-bound session once before any write.
    if (!input.uploadId) await limitReviewSubmission(request)
    await submitProductReview(form)
    return noStoreJson(
      {
        success: true,
        message:
          form.get('locale') === 'en'
            ? 'Your submission is awaiting moderation.'
            : 'Ваш відгук або відповідь очікує перевірки.',
      },
      { status: 201 },
    )
  } catch (error) {
    return apiErrorResponse(error)
  }
}
