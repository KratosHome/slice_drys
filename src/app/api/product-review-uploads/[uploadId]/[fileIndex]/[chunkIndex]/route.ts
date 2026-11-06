import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { requireReviewOrigin } from '@/server/reviews/review-request.server'
import {
  reviewUploadBearer,
  storeReviewUploadChunk,
} from '@/server/reviews/review-uploads.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ uploadId: string; fileIndex: string; chunkIndex: string }>
  },
) {
  try {
    requireReviewOrigin(request)
    const { uploadId, fileIndex, chunkIndex } = await params
    await storeReviewUploadChunk(
      request,
      uploadId,
      reviewUploadBearer(request),
      fileIndex,
      chunkIndex,
    )
    return noStoreJson({ success: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
