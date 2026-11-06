import 'server-only'

import { randomUUID } from 'node:crypto'
import cloudinary from '@/server/cloudinary-config.server'
import { sanitizeReviewPhotos } from './review-photo-validation'
import type { ReviewPhoto } from '@/types/product-review'

export function reviewPhotoDeliveryUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'image',
    type: 'authenticated',
    format: 'webp',
    secure: true,
    sign_url: true,
  })
}

export async function deleteReviewPhotos(photos: ReviewPhoto[]): Promise<void> {
  const results = await Promise.allSettled(
    photos.map(async ({ publicId }) => {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        type: 'authenticated',
        invalidate: true,
      })
      if (!['ok', 'not found'].includes(result.result)) {
        throw new Error('Review photo deletion failed')
      }
    }),
  )
  if (results.some((result) => result.status === 'rejected')) {
    throw new Error('Some review photos could not be deleted')
  }
}

export async function uploadReviewPhotos(
  files: File[],
): Promise<ReviewPhoto[]> {
  // Validate the entire batch before writing anything to storage.
  const images = await sanitizeReviewPhotos(files)
  const photos: ReviewPhoto[] = []
  try {
    for (const bytes of images) {
      const publicId = `product-reviews/${randomUUID()}`
      await new Promise<void>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'image',
            type: 'authenticated',
            format: 'webp',
            overwrite: false,
          },
          (error, result) => {
            if (error || !result)
              reject(error ?? new Error('Review photo upload failed'))
            else resolve()
          },
        )
        stream.on('error', reject)
        stream.end(bytes)
      })
      // The original upload and its signed URL are never returned to visitors.
      // Serializers expose only the status-aware application photo route.
      photos.push({ publicId, url: reviewPhotoDeliveryUrl(publicId) })
    }
    return photos
  } catch (error) {
    try {
      await deleteReviewPhotos(photos)
    } catch {
      console.error('Review photo upload rollback failed')
    }
    throw error
  }
}
