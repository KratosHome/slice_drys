import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { replyAsStore } from '@/server/reviews/product-reviews.server'
import {
  readReviewJson,
  requireReviewOrigin,
} from '@/server/reviews/review-request.server'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireReviewOrigin(request)
    const { id } = await params
    const body = await readReviewJson(request)
    await replyAsStore(id, body.text)
    return noStoreJson(
      { success: true, message: 'Відповідь магазину очікує перевірки' },
      { status: 201 },
    )
  } catch (error) {
    return apiErrorResponse(error)
  }
}
