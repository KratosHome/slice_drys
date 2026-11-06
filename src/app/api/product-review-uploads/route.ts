import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import {
  limitReviewSubmission,
  readReviewJson,
  requireReviewOrigin,
} from '@/server/reviews/review-request.server'
import { createReviewUpload } from '@/server/reviews/review-uploads.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    requireReviewOrigin(request)
    await limitReviewSubmission(request)
    const body = await readReviewJson(request)
    const data = await createReviewUpload(body)
    return noStoreJson({ success: true, data }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
