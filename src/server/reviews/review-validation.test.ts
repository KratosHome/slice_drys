import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseReviewSubmission } from './review-validation'
import { serializePublicReviews, type StoredReview } from './review-serializer'
import type { ReviewStatus } from '@/types/product-review'
import { REVIEW_MAX_PHOTO_BYTES } from '@/constants/product-review'

const productId = '111111111111111111111111'
const reviewId = '222222222222222222222222'

function submission(overrides: Record<string, string> = {}) {
  const form = new FormData()
  for (const [key, value] of Object.entries({
    productId,
    author: '  Олена  ',
    text: '  Смачний товар!  ',
    rating: '4',
    ...overrides,
  }))
    form.set(key, value)
  return form
}

test('review validation requires an integer rating and text, and never accepts client moderation privileges', () => {
  const parsed = parseReviewSubmission(submission())
  assert.equal(parsed.author, 'Олена')
  assert.equal(parsed.text, 'Смачний товар!')
  assert.equal(parsed.rating, 4)
  assert.equal(
    parseReviewSubmission(submission({ author: '', locale: 'en' })).author,
    'Guest',
  )
  for (const rating of ['', '0', '6', '4.5', '01', 'NaN'])
    assert.throws(() => parseReviewSubmission(submission({ rating })))
  for (const text of ['', ' ', 'x'.repeat(2001), 'bad\u0000text'])
    assert.throws(() => parseReviewSubmission(submission({ text })))
  for (const key of ['status', 'isStoreRepresentative', 'weight'])
    assert.throws(() =>
      parseReviewSubmission(submission({ [key]: 'approved' })),
    )
  assert.throws(() =>
    parseReviewSubmission(submission({ website: 'bot.example' })),
  )
  assert.throws(() =>
    parseReviewSubmission(submission({ productId: '{"$ne":null}' })),
  )
  const duplicate = submission()
  duplicate.append('rating', '5')
  assert.throws(() => parseReviewSubmission(duplicate))
})

test('replies cannot carry ratings or photos and uploads reject type, count, size before storage', () => {
  const reply = submission({ parentId: reviewId })
  assert.throws(() => parseReviewSubmission(reply))
  reply.delete('rating')
  assert.equal(parseReviewSubmission(reply).rating, undefined)
  reply.append(
    'photos',
    new File(['photo'], 'image.jpg', { type: 'image/jpeg' }),
  )
  assert.throws(() => parseReviewSubmission(reply))
  for (const photo of [
    new File(['svg'], 'bad.svg', { type: 'image/svg+xml' }),
    new File([new Uint8Array(REVIEW_MAX_PHOTO_BYTES + 1)], 'large.jpg', {
      type: 'image/jpeg',
    }),
    new File([], 'empty.jpg', { type: 'image/jpeg' }),
  ]) {
    const form = submission()
    form.append('photos', photo)
    assert.throws(() => parseReviewSubmission(form))
  }
  const tooMany = submission()
  for (let n = 0; n < 4; n++)
    tooMany.append(
      'photos',
      new File(['image'], 'image.jpg', { type: 'image/jpeg' }),
    )
  assert.throws(() => parseReviewSubmission(tooMany))
})

test('large originals use bounded upload references, never arbitrary URLs or reply attachments', () => {
  const uploadId = 'a'.repeat(32)
  const uploadToken = 'b'.repeat(64)
  const parsed = parseReviewSubmission(submission({ uploadId, uploadToken }))
  assert.equal(parsed.uploadId, uploadId)
  assert.equal(parsed.uploadToken, uploadToken)
  assert.equal(parsed.photos.length, 0)
  const invalidFields: Record<string, string>[] = [
    { uploadId },
    { uploadToken },
    { uploadId: 'https://evil.example/photo', uploadToken },
    { uploadId, uploadToken: 'invalid' },
  ]
  for (const fields of invalidFields)
    assert.throws(() => parseReviewSubmission(submission(fields)))
  const mixed = submission({ uploadId, uploadToken })
  mixed.append(
    'photos',
    new File(['image'], 'image.jpg', { type: 'image/jpeg' }),
  )
  assert.throws(() => parseReviewSubmission(mixed))
  const reply = submission({ uploadId, uploadToken, parentId: reviewId })
  reply.delete('rating')
  assert.throws(() => parseReviewSubmission(reply))
  for (const type of ['image/heic', 'image/heif', '']) {
    const form = submission()
    form.append('photos', new File(['heif'], 'camera.heic', { type }))
    assert.equal(parseReviewSubmission(form).photos.length, 1)
  }
  const atLimit = submission()
  atLimit.append(
    'photos',
    new File([new Uint8Array(REVIEW_MAX_PHOTO_BYTES)], 'camera.jpg', {
      type: 'image/jpeg',
    }),
  )
  assert.equal(parseReviewSubmission(atLimit).photos[0].size, 20 * 1024 * 1024)
})

function row(
  id: string,
  status: ReviewStatus,
  rating = 5,
  parentId: string | null = null,
): StoredReview {
  return {
    _id: id,
    productId,
    parentId,
    author: 'Guest',
    text: 'Review',
    rating,
    photos: [{ publicId: 'private-id', url: 'https://private.example/signed' }],
    status,
    isStoreRepresentative: false,
    createdAt: '2026-11-06T08:00:00.000Z',
  }
}

test('visible ratings use only this product’s approved roots, replies have exactly one level and no private asset URLs', () => {
  const rows = [
    row(reviewId, 'approved', 4),
    row('third', 'approved', 5),
    row('pending', 'pending', 1),
    row('hidden', 'hidden', 1),
    row('rejected', 'rejected', 1),
    {
      ...row('other-product', 'approved', 1),
      productId: '999999999999999999999999',
    },
    row('reply', 'approved', 1, reviewId),
    row('hidden-reply', 'hidden', 1, reviewId),
    row('pending-reply', 'pending', 1, reviewId),
    row('third-level', 'approved', 1, 'reply'),
    row('hidden-parent-reply', 'approved', 1, 'hidden'),
  ]
  const result = serializePublicReviews(productId, rows)
  assert.equal(result.averageRating, 4.5)
  assert.equal(result.ratingCount, 2)
  assert.equal(result.reviews[0].replies.length, 1)
  assert.equal(result.reviews[0].replies[0].id, 'reply')
  assert.equal('photos' in result.reviews[0].replies[0], false)
  assert.equal('rating' in result.reviews[0].replies[0], false)
  assert.ok(!JSON.stringify(result).includes('private'))
  assert.equal(
    result.reviews[0].photos[0].url,
    `/api/product-review-photos/${reviewId}/0`,
  )
  assert.deepEqual(serializePublicReviews(productId, []), {
    productId,
    reviews: [],
    ratingCount: 0,
    averageRating: null,
  })
  assert.equal(
    serializePublicReviews(productId, [
      row('a', 'approved', 4),
      row('b', 'approved', 5),
      row('c', 'approved', 5),
    ]).averageRating,
    4.7,
  )
})
