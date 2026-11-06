import 'server-only'

import { createHash } from 'node:crypto'
import { REVIEW_MAX_BODY_BYTES } from '@/constants/product-review'
import { SITE_URL } from '@/data/contacts'
import { ApiError } from '@/server/api-error.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { ReviewRateLimit } from './review-schema.server'

export function requireReviewOrigin(request: Request): void {
  const origin = request.headers.get('origin')
  const allowed = [new URL(request.url).origin, new URL(SITE_URL).origin]
  if (!origin || !allowed.includes(origin))
    throw new ApiError(403, 'Недозволене джерело запиту')
}

async function boundedBody(
  request: Request,
  limit: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const length = request.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > limit))
    throw new ApiError(413, 'Завеликий запит')
  if (!request.body) throw new ApiError(400, 'Порожній запит')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new ApiError(413, 'Завеликий запит')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}

export async function readReviewForm(request: Request): Promise<FormData> {
  const contentType = request.headers.get('content-type') ?? ''
  if (!/^multipart\/form-data\s*;/i.test(contentType))
    throw new ApiError(415, 'Очікується форма з фото')
  const body = await boundedBody(request, REVIEW_MAX_BODY_BYTES)
  try {
    return await new Response(body, {
      headers: { 'Content-Type': contentType },
    }).formData()
  } catch {
    throw new ApiError(400, 'Некоректна форма')
  }
}

export async function readReviewJson(
  request: Request,
): Promise<Record<string, unknown>> {
  if (
    !/^application\/json(?:;|$)/i.test(
      request.headers.get('content-type') ?? '',
    )
  )
    throw new ApiError(415, 'Очікується JSON')
  const body = await boundedBody(request, 16 * 1024)
  try {
    const result: unknown = JSON.parse(new TextDecoder().decode(body))
    if (!result || typeof result !== 'object' || Array.isArray(result))
      throw new Error('Invalid object')
    return result as Record<string, unknown>
  } catch {
    throw new ApiError(400, 'Некоректні дані запиту')
  }
}

async function takeRateLimit(
  key: string,
  limit: number,
  now: number,
): Promise<void> {
  const windowMs = 15 * 60 * 1000
  const bucket = Math.floor(now / windowMs)
  try {
    await ReviewRateLimit.findOneAndUpdate(
      { _id: `${key}:${bucket}`, count: { $lt: limit } },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) },
      },
      { upsert: true, returnDocument: 'after' },
    )
  } catch (error) {
    // The deterministic _id makes the limit atomic across concurrent instances.
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    )
      throw new ApiError(429, 'Забагато спроб. Спробуйте через 15 хвилин')
    throw error
  }
}

export async function limitReviewSubmission(request: Request): Promise<void> {
  await connectToDbServer()
  // Vercel overwrites this header. Never trust a caller-supplied X-Forwarded-For
  // on an unknown proxy; the conservative shared fallback still limits abuse.
  const forwarded =
    process.env.VERCEL === '1'
      ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
      : undefined
  const identity = forwarded || 'shared'
  const hash = createHash('sha256')
    .update(`${process.env.NEXTAUTH_SECRET ?? 'reviews'}:${identity}`)
    .digest('hex')
  const now = Date.now()
  await takeRateLimit(`client:${hash}`, forwarded ? 5 : 30, now)
  await takeRateLimit('global', 100, now)
}
