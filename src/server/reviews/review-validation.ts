import {
  REVIEW_MAX_NAME_LENGTH,
  REVIEW_MAX_PHOTOS,
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_MAX_TEXT_LENGTH,
  reviewPhotoMimeType,
} from '@/constants/product-review'
import { ApiError } from '@/server/api-error.server'
import { REVIEW_STATUSES, type ReviewStatus } from '@/types/product-review'

export function reviewObjectId(value: unknown): string {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value))
    throw new ApiError(400, 'Некоректний ідентифікатор')
  return value.toLowerCase()
}

function field(form: FormData, key: string): string {
  const entries = form.getAll(key)
  if (
    entries.length > 1 ||
    (entries.length === 1 && typeof entries[0] !== 'string')
  )
    throw new ApiError(400, 'Некоректні дані форми')
  return (entries[0] as string | undefined)?.trim() ?? ''
}

export function validateReviewText(value: unknown): string {
  if (typeof value !== 'string')
    throw new ApiError(400, 'Додайте текст відгуку або відповіді')
  const text = value.trim()
  if (
    !text ||
    text.length > REVIEW_MAX_TEXT_LENGTH ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)
  ) {
    throw new ApiError(
      400,
      `Текст має містити від 1 до ${REVIEW_MAX_TEXT_LENGTH} символів`,
    )
  }
  return text
}

export function validateReviewStatus(value: unknown): ReviewStatus {
  if (
    typeof value !== 'string' ||
    !(REVIEW_STATUSES as readonly string[]).includes(value)
  )
    throw new ApiError(400, 'Некоректний статус')
  return value as ReviewStatus
}

export function parseReviewSubmission(form: FormData) {
  const allowed = new Set([
    'productId',
    'parentId',
    'author',
    'text',
    'rating',
    'photos',
    'uploadId',
    'uploadToken',
    'website',
    'locale',
  ])
  if (Array.from(form.keys()).some((key) => !allowed.has(key)))
    throw new ApiError(400, 'Некоректні поля форми')
  if (field(form, 'website'))
    throw new ApiError(400, 'Не вдалося відправити відгук')
  const productId = reviewObjectId(field(form, 'productId'))
  const parent = field(form, 'parentId')
  const parentId = parent ? reviewObjectId(parent) : null
  const locale = field(form, 'locale') === 'en' ? 'en' : 'uk'
  const author = field(form, 'author') || (locale === 'uk' ? 'Гість' : 'Guest')
  if (author.length > REVIEW_MAX_NAME_LENGTH || /[\u0000-\u001F]/.test(author))
    throw new ApiError(400, 'Некоректне ім’я автора')
  const text = validateReviewText(field(form, 'text'))
  const rawRating = field(form, 'rating')
  const uploadId = field(form, 'uploadId')
  const uploadToken = field(form, 'uploadToken')
  if (
    Boolean(uploadId) !== Boolean(uploadToken) ||
    (uploadId &&
      (!/^[a-f\d]{32}$/.test(uploadId) || !/^[a-f\d]{64}$/.test(uploadToken)))
  )
    throw new ApiError(400, 'Некоректне завантаження фото')
  const photos = form.getAll('photos')
  if (
    photos.length > REVIEW_MAX_PHOTOS ||
    photos.some(
      (photo) =>
        typeof photo === 'string' ||
        photo.size === 0 ||
        photo.size > REVIEW_MAX_PHOTO_BYTES ||
        !reviewPhotoMimeType(photo),
    )
  ) {
    throw new ApiError(
      400,
      'Додайте до 3 фото HEIC/HEIF, JPEG, PNG або WebP, до 20 МіБ кожне',
    )
  }
  if (uploadId && photos.length)
    throw new ApiError(
      400,
      'Не можна поєднувати різні способи завантаження фото',
    )
  if (parentId && (form.has('rating') || photos.length > 0 || uploadId))
    throw new ApiError(400, 'Відповідь не може містити оцінку чи фото')
  if (!parentId && !/^[1-5]$/.test(rawRating))
    throw new ApiError(400, 'Оберіть оцінку від 1 до 5')
  return {
    productId,
    parentId,
    locale,
    author,
    text,
    rating: parentId ? undefined : Number(rawRating),
    photos: photos as File[],
    uploadId,
    uploadToken,
  }
}
