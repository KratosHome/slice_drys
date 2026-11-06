import {
  REVIEW_MAX_PHOTOS,
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_UPLOAD_CHUNK_BYTES,
  reviewPhotoMimeType,
} from '@/constants/product-review'

export class ReviewUploadError extends Error {}

type UploadSession = {
  uploadId: string
  uploadToken: string
  chunkBytes: number
}

async function uploadResponse(
  response: Response,
): Promise<Record<string, unknown>> {
  const result: unknown = await response.json()
  if (
    !result ||
    typeof result !== 'object' ||
    !('success' in result) ||
    result.success !== true ||
    !response.ok
  ) {
    const message =
      result &&
      typeof result === 'object' &&
      'message' in result &&
      typeof result.message === 'string'
        ? result.message
        : ''
    throw new ReviewUploadError(message)
  }
  return result as Record<string, unknown>
}

export async function uploadReviewPhotoFiles({
  productId,
  files,
  website,
  signal,
  onProgress,
}: {
  productId: string
  files: File[]
  website: string
  signal: AbortSignal
  onProgress: (percent: number) => void
}): Promise<Pick<UploadSession, 'uploadId' | 'uploadToken'>> {
  if (
    !files.length ||
    files.length > REVIEW_MAX_PHOTOS ||
    files.some(
      (file) =>
        !reviewPhotoMimeType(file) ||
        file.size === 0 ||
        file.size > REVIEW_MAX_PHOTO_BYTES,
    )
  ) {
    throw new ReviewUploadError('Некоректні фото')
  }
  const response = await uploadResponse(
    await fetch('/api/product-review-uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        website,
        files: files.map((file) => ({
          name: file.name,
          type: reviewPhotoMimeType(file),
          size: file.size,
        })),
      }),
      signal,
    }),
  )
  const session = response.data as UploadSession | undefined
  if (
    !session ||
    !/^[a-f\d]{32}$/.test(session.uploadId) ||
    !/^[a-f\d]{64}$/.test(session.uploadToken) ||
    session.chunkBytes !== REVIEW_UPLOAD_CHUNK_BYTES
  ) {
    throw new ReviewUploadError('')
  }
  const total = files.reduce((sum, file) => sum + file.size, 0)
  let sent = 0
  onProgress(0)
  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const file = files[fileIndex]
    for (
      let offset = 0, chunkIndex = 0;
      offset < file.size;
      offset += session.chunkBytes, chunkIndex++
    ) {
      const body = file.slice(
        offset,
        Math.min(offset + session.chunkBytes, file.size),
      )
      await uploadResponse(
        await fetch(
          `/api/product-review-uploads/${session.uploadId}/${fileIndex}/${chunkIndex}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${session.uploadToken}`,
              'Content-Type': 'application/octet-stream',
            },
            body,
            signal,
          },
        ),
      )
      sent += body.size
      onProgress(Math.round((sent / total) * 100))
    }
  }
  return { uploadId: session.uploadId, uploadToken: session.uploadToken }
}
