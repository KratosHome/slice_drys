import sharp, { type Sharp } from 'sharp'

import {
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_MAX_PHOTOS,
  REVIEW_MAX_PHOTO_PIXELS,
  REVIEW_PHOTO_MAX_EDGE,
  REVIEW_PHOTO_QUALITY,
  reviewPhotoMimeType,
} from '@/constants/product-review'
import { ApiError } from '@/server/api-error.server'
import { decodeHeifPhoto } from './heif-decode.server'

const FORMATS: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function matchesSignature(bytes: Buffer, type: string): boolean {
  if (type === 'image/heic' || type === 'image/heif') {
    if (bytes.length < 16 || bytes.toString('ascii', 4, 8) !== 'ftyp')
      return false
    const boxSize = bytes.readUInt32BE(0)
    if (boxSize < 16 || boxSize > bytes.length || boxSize > 4096) return false
    const brands = [bytes.toString('ascii', 8, 12)]
    for (let offset = 16; offset + 4 <= boxSize; offset += 4)
      brands.push(bytes.toString('ascii', offset, offset + 4))
    // AVIF shares the ISO-BMFF container, but is not an allowed input format.
    if (brands.some((brand) => ['avif', 'avis', 'av01'].includes(brand)))
      return false
    return brands.some((brand) =>
      [
        'mif1',
        'msf1',
        'heic',
        'heix',
        'hevc',
        'hevx',
        'heim',
        'heis',
        'hevm',
        'hevs',
      ].includes(brand),
    )
  }
  if (type === 'image/jpeg') {
    return bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  }
  if (type === 'image/png') {
    return bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  }
  return (
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  )
}

export async function sanitizeReviewPhotos(files: File[]): Promise<Buffer[]> {
  if (files.length > REVIEW_MAX_PHOTOS) {
    throw new ApiError(400, `Можна додати не більше ${REVIEW_MAX_PHOTOS} фото`)
  }

  const sanitized: Buffer[] = []
  for (const file of files) {
    const type = reviewPhotoMimeType(file)
    if (!type) {
      throw new ApiError(
        400,
        'Дозволені лише фото HEIC, HEIF, JPEG, PNG та WebP',
      )
    }
    if (file.size === 0 || file.size > REVIEW_MAX_PHOTO_BYTES) {
      throw new ApiError(
        400,
        'Кожне фото має бути непорожнім і не більшим за 20 МіБ',
      )
    }
    const bytes = Buffer.from(await file.arrayBuffer())
    if (!matchesSignature(bytes, type)) {
      throw new ApiError(400, 'Вміст фото не відповідає його типу')
    }

    try {
      let image: Sharp
      if (type === 'image/heic' || type === 'image/heif') {
        const decoded = await decodeHeifPhoto(bytes)
        image = sharp(decoded.data, {
          raw: { width: decoded.width, height: decoded.height, channels: 4 },
          limitInputPixels: REVIEW_MAX_PHOTO_PIXELS,
        })
      } else {
        image = sharp(bytes, {
          limitInputPixels: REVIEW_MAX_PHOTO_PIXELS,
          failOn: 'warning',
        })
        const metadata = await image.metadata()
        if (metadata.format !== FORMATS[type] || (metadata.pages ?? 1) > 1) {
          throw new Error('Unsupported image format or animation')
        }
      }
      // Decode and re-encode before upload. Sharp strips EXIF (including GPS),
      // XMP, IPTC and ICC metadata by default; never call keepMetadata here.
      sanitized.push(
        await image
          .rotate()
          .resize({
            width: REVIEW_PHOTO_MAX_EDGE,
            height: REVIEW_PHOTO_MAX_EDGE,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: REVIEW_PHOTO_QUALITY })
          .toBuffer(),
      )
    } catch {
      throw new ApiError(
        400,
        'Фото пошкоджене, використовує непідтримуваний кодек, анімоване або має надто велику роздільність',
      )
    }
  }
  return sanitized
}
