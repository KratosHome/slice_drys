import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { getAdminProductReviews } from '@/server/reviews/product-reviews.server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const data = await getAdminProductReviews(new URL(request.url).searchParams)
    return noStoreJson({ success: true, data })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
