export const REVIEW_MAX_PHOTOS = 3
export const REVIEW_MAX_PHOTO_BYTES = 20 * 1024 * 1024
export const REVIEW_UPLOAD_CHUNK_BYTES = 1024 * 1024
export const REVIEW_UPLOAD_STORAGE_BUDGET_BYTES = 256 * 1024 * 1024
export const REVIEW_MAX_PHOTO_PIXELS = 60_000_000
export const REVIEW_PHOTO_MAX_EDGE = 2048
export const REVIEW_PHOTO_QUALITY = 82
// Originals travel in bounded chunks; final submission contains only references.
export const REVIEW_MAX_BODY_BYTES = 4 * 1024 * 1024
export const REVIEW_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const
export const REVIEW_PHOTO_ACCEPT = `${REVIEW_PHOTO_TYPES.join(',')},.heic,.heif`

export function reviewPhotoMimeType(file: {
  type: string
  name: string
}): string {
  const type = file.type.toLowerCase()
  if ((REVIEW_PHOTO_TYPES as readonly string[]).includes(type)) return type
  // Some browsers omit MIME for HEIF. The server still checks actual bytes.
  if (!type || type === 'application/octet-stream') {
    if (/\.heic$/i.test(file.name)) return 'image/heic'
    if (/\.heif$/i.test(file.name)) return 'image/heif'
  }
  return ''
}
export const REVIEW_MAX_TEXT_LENGTH = 2000
export const REVIEW_MAX_NAME_LENGTH = 80
