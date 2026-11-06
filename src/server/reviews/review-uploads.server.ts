import 'server-only'

import { createHash, randomBytes } from 'node:crypto'
import {
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_MAX_PHOTOS,
  REVIEW_PHOTO_TYPES,
  REVIEW_UPLOAD_CHUNK_BYTES,
  REVIEW_UPLOAD_STORAGE_BUDGET_BYTES,
  reviewPhotoMimeType,
} from '@/constants/product-review'
import { ApiError } from '@/server/api-error.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import { reviewObjectId } from './review-validation'
import {
  ReviewUploadChunk,
  ReviewUploadQuota,
  ReviewUploadSession,
} from './review-upload-schema.server'

type UploadFile = { name: string; type: string; size: number }
type UploadSession = {
  _id: string
  tokenHash: string
  productId: { toString(): string } | string
  files: UploadFile[]
  state: 'open' | 'processing'
  expiresAt: Date
}
type UploadChunk = {
  _id: string
  fileIndex: number
  chunkIndex: number
  hash: string
  data: Buffer | { buffer: Uint8Array }
}

const UPLOAD_LIFETIME_MS = 30 * 60 * 1000
const QUOTA_ID = 'product-review-originals'
const MAX_ACTIVE_UPLOAD_SESSIONS = 256
function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex')
}

function credentials(uploadId: unknown, token: unknown) {
  if (
    typeof uploadId !== 'string' ||
    !/^[a-f\d]{32}$/.test(uploadId) ||
    typeof token !== 'string' ||
    !/^[a-f\d]{64}$/.test(token)
  ) {
    throw new ApiError(
      404,
      'Завантаження не знайдено або термін його дії минув',
    )
  }
  return { _id: uploadId, tokenHash: sha256(token) }
}

function parseFile(value: unknown): UploadFile {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ApiError(400, 'Некоректні дані фото')
  const file = value as Record<string, unknown>
  if (Object.keys(file).some((key) => !['name', 'type', 'size'].includes(key)))
    throw new ApiError(400, 'Некоректні дані фото')
  const name = typeof file.name === 'string' ? file.name.trim() : ''
  const type = reviewPhotoMimeType({
    name,
    type: typeof file.type === 'string' ? file.type : '',
  })
  if (
    !name ||
    name.length > 255 ||
    /[\u0000-\u001f]/.test(name) ||
    !(REVIEW_PHOTO_TYPES as readonly string[]).includes(type)
  ) {
    throw new ApiError(400, 'Дозволені лише фото HEIC/HEIF, JPEG, PNG та WebP')
  }
  if (
    typeof file.size !== 'number' ||
    !Number.isSafeInteger(file.size) ||
    file.size <= 0 ||
    file.size > REVIEW_MAX_PHOTO_BYTES
  ) {
    throw new ApiError(
      400,
      'Кожне фото має бути непорожнім і не більшим за 20 МіБ',
    )
  }
  return { name, type, size: file.size }
}

function isDuplicateKey(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 11000,
  )
}

async function releaseUploadStorage(
  uploadId: string,
  tokenHash: string,
): Promise<void> {
  await ReviewUploadQuota.updateOne(
    { _id: QUOTA_ID },
    { $pull: { slots: { uploadId, tokenHash } } },
  )
}

async function reserveUploadStorage(slot: {
  uploadId: string
  tokenHash: string
  bytes: number
  expiresAt: Date
}): Promise<void> {
  const cleanup = { $pull: { slots: { expiresAt: { $lte: new Date() } } } }
  try {
    // The singleton _id arbitrates the first two concurrent admissions too.
    await ReviewUploadQuota.updateOne({ _id: QUOTA_ID }, cleanup, {
      upsert: true,
      setDefaultsOnInsert: false,
    })
  } catch (error) {
    if (!isDuplicateKey(error)) throw error
    await ReviewUploadQuota.updateOne({ _id: QUOTA_ID }, cleanup)
  }
  const reserved = await ReviewUploadQuota.findOneAndUpdate(
    {
      _id: QUOTA_ID,
      $expr: {
        $and: [
          {
            $lte: [
              {
                $add: [{ $sum: { $ifNull: ['$slots.bytes', []] } }, slot.bytes],
              },
              REVIEW_UPLOAD_STORAGE_BUDGET_BYTES,
            ],
          },
          {
            $lt: [
              { $size: { $ifNull: ['$slots', []] } },
              MAX_ACTIVE_UPLOAD_SESSIONS,
            ],
          },
        ],
      },
    },
    { $push: { slots: slot } },
    { returnDocument: 'after', runValidators: true },
  )
    .select('_id')
    .lean<{ _id: string } | null>()
  if (!reserved)
    throw new ApiError(
      429,
      'Завантаження фото тимчасово зайняте. Спробуйте трохи пізніше',
    )
}

export async function createReviewUpload(body: Record<string, unknown>) {
  if (
    Object.keys(body).some(
      (key) => !['productId', 'files', 'website'].includes(key),
    ) ||
    (body.website != null && body.website !== '')
  )
    throw new ApiError(400, 'Некоректні дані завантаження')
  const productId = reviewObjectId(body.productId)
  if (
    !Array.isArray(body.files) ||
    body.files.length < 1 ||
    body.files.length > REVIEW_MAX_PHOTOS
  )
    throw new ApiError(400, 'Додайте від 1 до 3 фото')
  const files = body.files.map(parseFile)
  await connectToDbServer()
  if (!(await Product.exists({ _id: productId })))
    throw new ApiError(404, 'Товар не знайдено')
  const uploadId = randomBytes(16).toString('hex')
  const uploadToken = randomBytes(32).toString('hex')
  const tokenHash = sha256(uploadToken)
  const expiresAt = new Date(Date.now() + UPLOAD_LIFETIME_MS)
  await reserveUploadStorage({
    uploadId,
    tokenHash,
    bytes: files.reduce((sum, file) => sum + file.size, 0),
    expiresAt,
  })
  try {
    await ReviewUploadSession.create({
      _id: uploadId,
      tokenHash,
      productId,
      files,
      state: 'open',
      expiresAt,
    })
  } catch (error) {
    try {
      await releaseUploadStorage(uploadId, tokenHash)
    } catch {
      console.error('Review upload storage reservation cleanup failed')
    }
    throw error
  }
  return { uploadId, uploadToken, chunkBytes: REVIEW_UPLOAD_CHUNK_BYTES }
}

async function openSession(
  uploadId: string,
  token: string,
): Promise<UploadSession> {
  const identity = credentials(uploadId, token)
  await connectToDbServer()
  const session = await ReviewUploadSession.findOne({
    ...identity,
    state: 'open',
    expiresAt: { $gt: new Date() },
  }).lean<UploadSession | null>()
  if (!session)
    throw new ApiError(
      404,
      'Завантаження не знайдено або термін його дії минув',
    )
  return session
}

function index(value: string): number {
  if (!/^(0|[1-9]\d{0,2})$/.test(value))
    throw new ApiError(400, 'Некоректна частина фото')
  return Number(value)
}

async function readChunk(request: Request, expected: number): Promise<Buffer> {
  if (
    !/^application\/octet-stream(?:;|$)/i.test(
      request.headers.get('content-type') ?? '',
    )
  )
    throw new ApiError(415, 'Очікуються дані фото')
  const length = request.headers.get('content-length')
  if (length !== null && (!/^\d+$/.test(length) || Number(length) !== expected))
    throw new ApiError(400, 'Неправильний розмір частини фото')
  if (!request.body) throw new ApiError(400, 'Порожня частина фото')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > expected || size > REVIEW_UPLOAD_CHUNK_BYTES) {
        await reader.cancel()
        throw new ApiError(413, 'Завелика частина фото')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  if (size !== expected)
    throw new ApiError(400, 'Неправильний розмір частини фото')
  return Buffer.concat(chunks, size)
}

export function reviewUploadBearer(request: Request): string {
  const authorization = request.headers.get('authorization') ?? ''
  const match = /^Bearer ([a-f\d]{64})$/.exec(authorization)
  if (!match)
    throw new ApiError(
      404,
      'Завантаження не знайдено або термін його дії минув',
    )
  return match[1]
}

export async function storeReviewUploadChunk(
  request: Request,
  uploadId: string,
  token: string,
  fileValue: string,
  chunkValue: string,
): Promise<void> {
  const session = await openSession(uploadId, token)
  const fileIndex = index(fileValue)
  const chunkIndex = index(chunkValue)
  const file = session.files[fileIndex]
  if (!file || chunkIndex >= Math.ceil(file.size / REVIEW_UPLOAD_CHUNK_BYTES))
    throw new ApiError(400, 'Некоректна частина фото')
  const expected = Math.min(
    REVIEW_UPLOAD_CHUNK_BYTES,
    file.size - chunkIndex * REVIEW_UPLOAD_CHUNK_BYTES,
  )
  const data = await readChunk(request, expected)
  const hash = sha256(data)
  const chunkId = `${uploadId}:${fileIndex}:${chunkIndex}`
  try {
    await ReviewUploadChunk.create({
      _id: chunkId,
      uploadId,
      fileIndex,
      chunkIndex,
      hash,
      data,
      expiresAt: session.expiresAt,
    })
  } catch (error) {
    if (!isDuplicateKey(error)) throw error
    const existing = await ReviewUploadChunk.findById(chunkId)
      .select('hash')
      .lean<{ hash: string } | null>()
    if (existing?.hash !== hash)
      throw new ApiError(409, 'Цю частину фото вже завантажено з іншим вмістом')
  }
  // An in-flight request must not leave data behind if the session was deleted
  // or expired while its body was arriving. Processing uses immutable chunks.
  if (
    !(await ReviewUploadSession.exists({
      ...credentials(uploadId, token),
      expiresAt: { $gt: new Date() },
    }))
  ) {
    await ReviewUploadChunk.deleteOne({ _id: chunkId })
    throw new ApiError(
      404,
      'Завантаження не знайдено або термін його дії минув',
    )
  }
}

export async function claimReviewUpload(
  uploadId: string,
  token: string,
  productId: string,
): Promise<File[]> {
  const session = await openSession(uploadId, token)
  if (String(session.productId) !== reviewObjectId(productId))
    throw new ApiError(400, 'Фото належать іншому товару')
  const expectedCount = session.files.reduce(
    (sum, file) => sum + Math.ceil(file.size / REVIEW_UPLOAD_CHUNK_BYTES),
    0,
  )
  if ((await ReviewUploadChunk.countDocuments({ uploadId })) !== expectedCount)
    throw new ApiError(409, 'Завантажте всі частини фото перед відправленням')
  // Claim before loading any binary data: concurrent attempts must not each
  // allocate and hash up to 60 MiB. Incomplete uploads remain resumable above.
  const claimed = await ReviewUploadSession.findOneAndUpdate(
    {
      ...credentials(uploadId, token),
      state: 'open',
      expiresAt: { $gt: new Date() },
    },
    { $set: { state: 'processing' } },
    { returnDocument: 'after' },
  ).lean<UploadSession | null>()
  if (!claimed)
    throw new ApiError(
      409,
      'Ці фото вже використано або термін завантаження минув',
    )
  try {
    const chunks = await ReviewUploadChunk.find({ uploadId })
      .sort({ fileIndex: 1, chunkIndex: 1 })
      .lean<UploadChunk[]>()
    if (chunks.length !== expectedCount)
      throw new ApiError(400, 'Неповні або пошкоджені дані фото')
    const files: File[] = []
    let offset = 0
    for (const [fileIndex, file] of session.files.entries()) {
      const parts: Buffer[] = []
      for (
        let chunkIndex = 0;
        chunkIndex < Math.ceil(file.size / REVIEW_UPLOAD_CHUNK_BYTES);
        chunkIndex++
      ) {
        const chunk = chunks[offset++]
        const bytes = Buffer.isBuffer(chunk.data)
          ? chunk.data
          : Buffer.from(chunk.data.buffer)
        const expected = Math.min(
          REVIEW_UPLOAD_CHUNK_BYTES,
          file.size - chunkIndex * REVIEW_UPLOAD_CHUNK_BYTES,
        )
        if (
          chunk.fileIndex !== fileIndex ||
          chunk.chunkIndex !== chunkIndex ||
          bytes.length !== expected ||
          sha256(bytes) !== chunk.hash
        )
          throw new ApiError(400, 'Неповні або пошкоджені дані фото')
        parts.push(bytes)
      }
      files.push(
        new File(
          parts.map((part) => new Uint8Array(part)),
          file.name,
          { type: file.type },
        ),
      )
    }
    return files
  } catch (error) {
    // The caller never receives a claim when reconstruction fails. Remove it
    // here; independent TTL indexes remain the fallback on database outages.
    try {
      await deleteReviewUpload(uploadId, token)
    } catch {
      console.error('Review upload reconstruction cleanup failed')
    }
    throw error
  }
}

export async function deleteReviewUpload(
  uploadId: string,
  token: string,
): Promise<void> {
  const identity = credentials(uploadId, token)
  await connectToDbServer()
  const session = await ReviewUploadSession.findOne(identity)
    .select('_id')
    .lean<{ _id: string } | null>()
  // A prior cleanup may already have removed the session before the binary
  // deletion failed. The hashed token on its quota slot authorizes a retry.
  const ownsReservation =
    session ||
    (await ReviewUploadQuota.exists({
      _id: QUOTA_ID,
      slots: { $elemMatch: { uploadId, tokenHash: identity.tokenHash } },
    }))
  if (!ownsReservation) return
  await ReviewUploadSession.deleteOne(identity)
  await ReviewUploadChunk.deleteMany({ uploadId })
  await releaseUploadStorage(uploadId, identity.tokenHash)
}
