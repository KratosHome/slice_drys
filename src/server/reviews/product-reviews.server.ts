import 'server-only'

import { revalidatePath } from 'next/cache'
import { ApiError } from '@/server/api-error.server'
import { requirePermission } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import type {
  AdminProductReviewsData,
  ProductReviewsData,
  ReviewPhoto,
} from '@/types/product-review'
import { ProductReviewModel } from './review-schema.server'
import {
  parseReviewSubmission,
  reviewObjectId,
  validateReviewStatus,
  validateReviewText,
} from './review-validation'
import {
  serializePublicReviews,
  serializeReviewPhotos,
  serializeReviewReply,
  type StoredReview,
} from './review-serializer'
import { deleteReviewPhotos, uploadReviewPhotos } from './review-photos.server'
import { sendProductReviewNotification } from './review-notification.server'
import { claimReviewUpload, deleteReviewUpload } from './review-uploads.server'

interface ReviewProduct {
  _id: { toString(): string }
  name: { uk?: string; en?: string }
  slug: string
}

function invalidateReviews() {
  revalidatePath('/[locale]/products/[category]/product/[slug]', 'page')
}

async function approvedParent(
  parentId: string,
  productId?: string,
): Promise<StoredReview> {
  const parent = await ProductReviewModel.findOne({
    _id: parentId,
    parentId: null,
    status: 'approved',
    ...(productId ? { productId } : {}),
  }).lean<StoredReview | null>()
  if (!parent)
    throw new ApiError(
      400,
      'Відповісти можна лише на схвалений відгук цього товару',
    )
  return parent
}

export async function getProductReviews(
  productId: string,
): Promise<ProductReviewsData> {
  reviewObjectId(productId)
  await connectToDbServer()
  const roots = await ProductReviewModel.find({
    productId,
    parentId: null,
    status: 'approved',
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean<StoredReview[]>()
  const replies = roots.length
    ? await ProductReviewModel.find({
        productId,
        parentId: { $in: roots.map((review) => review._id) },
        status: 'approved',
      })
        .sort({ createdAt: 1, _id: 1 })
        .lean<StoredReview[]>()
    : []
  return serializePublicReviews(productId, [...roots, ...replies])
}

export async function submitProductReview(form: FormData): Promise<void> {
  const input = parseReviewSubmission(form)
  await connectToDbServer()
  const product = await Product.findById(input.productId)
    .select('_id name slug')
    .lean<ReviewProduct | null>()
  if (!product) throw new ApiError(404, 'Товар не знайдено')
  if (input.parentId) await approvedParent(input.parentId, input.productId)
  let photos: ReviewPhoto[] = []
  let saved = false
  let claimed = false
  try {
    const originals = input.uploadId
      ? await claimReviewUpload(
          input.uploadId,
          input.uploadToken,
          input.productId,
        )
      : input.photos
    claimed = Boolean(input.uploadId)
    photos = await uploadReviewPhotos(originals)
    const review = await ProductReviewModel.create({
      productId: input.productId,
      parentId: input.parentId,
      author: input.author,
      text: input.text,
      rating: input.rating,
      photos,
      status: 'pending',
      isStoreRepresentative: false,
    })
    // If moderation removed the parent during submission, don't leave an orphan.
    if (
      input.parentId &&
      !(await ProductReviewModel.exists({
        _id: input.parentId,
        parentId: null,
        productId: input.productId,
      }))
    ) {
      await ProductReviewModel.deleteOne({ _id: review._id })
      throw new ApiError(400, 'Відгук більше недоступний')
    }
    saved = true
  } catch (error) {
    if (!saved && photos.length) await deleteReviewPhotos(photos)
    throw error
  } finally {
    if (claimed) {
      try {
        await deleteReviewUpload(input.uploadId, input.uploadToken)
      } catch {
        // TTL also expires staged originals; cleanup cannot undo a saved review.
        console.error('Temporary review upload cleanup failed')
      }
    }
  }
  await sendProductReviewNotification({
    productName: product.name.uk || product.name.en || product.slug,
    author: input.author,
    text: input.text,
    rating: input.rating,
    photoCount: photos.length,
    isReply: Boolean(input.parentId),
  })
}

export async function getAdminProductReviews(
  params: URLSearchParams,
): Promise<AdminProductReviewsData> {
  await requirePermission('reviews:manage')
  const status = params.get('status') || 'pending'
  if (status !== 'all') validateReviewStatus(status)
  const kind = params.get('kind') || 'all'
  if (!['all', 'reviews', 'replies'].includes(kind))
    throw new ApiError(400, 'Некоректний тип відгуків')
  const rawPage = params.get('page') || '1'
  if (!/^\d+$/.test(rawPage) || Number(rawPage) < 1 || Number(rawPage) > 10000)
    throw new ApiError(400, 'Некоректна сторінка')
  const page = Number(rawPage)
  const pageSize = 20
  const filter = {
    ...(status === 'all' ? {} : { status }),
    ...(kind === 'reviews'
      ? { parentId: null }
      : kind === 'replies'
        ? { parentId: { $ne: null } }
        : {}),
  }
  await connectToDbServer()
  const [rows, total] = await Promise.all([
    ProductReviewModel.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean<StoredReview[]>(),
    ProductReviewModel.countDocuments(filter),
  ])
  const [products, parents] = await Promise.all([
    Product.find({ _id: { $in: rows.map((row) => row.productId) } })
      .select('_id name slug')
      .lean<ReviewProduct[]>(),
    ProductReviewModel.find({
      _id: { $in: rows.flatMap((row) => (row.parentId ? [row.parentId] : [])) },
    })
      .select('_id text')
      .lean<StoredReview[]>(),
  ])
  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  )
  const parentMap = new Map(
    parents.map((parent) => [String(parent._id), parent.text]),
  )
  return {
    page,
    pageSize,
    total,
    items: rows.map((row) => {
      const product = productMap.get(String(row.productId))
      return {
        ...serializeReviewReply(row),
        productId: String(row.productId),
        productName: product?.name.uk || product?.name.en || 'Видалений товар',
        productSlug: product?.slug || '',
        parentId: row.parentId ? String(row.parentId) : null,
        parentText: row.parentId
          ? (parentMap.get(String(row.parentId)) ?? null)
          : null,
        rating: row.rating ?? null,
        photos: serializeReviewPhotos(row),
        status: row.status,
      }
    }),
  }
}

export async function moderateProductReview(
  id: string,
  inputStatus: unknown,
): Promise<void> {
  const identity = await requirePermission('reviews:manage')
  reviewObjectId(id)
  const status = validateReviewStatus(inputStatus)
  await connectToDbServer()
  const row = await ProductReviewModel.findById(id).lean<StoredReview | null>()
  if (!row) throw new ApiError(404, 'Відгук не знайдено')
  if (status === 'approved' && row.parentId)
    await approvedParent(String(row.parentId), String(row.productId))
  await ProductReviewModel.updateOne(
    { _id: id },
    { $set: { status, moderatedBy: identity.id, moderatedAt: new Date() } },
    { runValidators: true },
  )
  invalidateReviews()
}

export async function deleteProductReview(id: string): Promise<void> {
  await requirePermission('reviews:manage')
  reviewObjectId(id)
  await connectToDbServer()
  const row = await ProductReviewModel.findOneAndUpdate(
    { _id: id },
    { $set: { status: 'hidden' } },
    { returnDocument: 'after' },
  ).lean<StoredReview | null>()
  if (!row) throw new ApiError(404, 'Відгук не знайдено')
  invalidateReviews()
  // Keep a hidden record if cloud deletion fails, allowing the administrator to
  // retry instead of losing the storage references to private photos.
  await deleteReviewPhotos(row.photos ?? [])
  await ProductReviewModel.deleteOne({ _id: id })
  if (!row.parentId) await ProductReviewModel.deleteMany({ parentId: id })
}

export async function replyAsStore(id: string, text: unknown): Promise<void> {
  const identity = await requirePermission('reviews:manage')
  reviewObjectId(id)
  const content = validateReviewText(text)
  await connectToDbServer()
  const parent = await approvedParent(id)
  const product = await Product.findById(parent.productId)
    .select('_id name slug')
    .lean<ReviewProduct | null>()
  if (!product) throw new ApiError(404, 'Товар не знайдено')
  const reply = await ProductReviewModel.create({
    productId: parent.productId,
    parentId: parent._id,
    author: identity.name || 'SliceDrys',
    text: content,
    status: 'pending',
    isStoreRepresentative: true,
  })
  if (!(await ProductReviewModel.exists({ _id: id, parentId: null }))) {
    await ProductReviewModel.deleteOne({ _id: reply._id })
    throw new ApiError(400, 'Відгук більше недоступний')
  }
  await sendProductReviewNotification({
    productName: product.name.uk || product.name.en || product.slug,
    author: identity.name || 'SliceDrys',
    text: content,
    photoCount: 0,
    isReply: true,
  })
}
