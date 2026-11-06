import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('review lifecycle enforces moderation, product-level ratings, parent constraints, permissions and photo cleanup', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    const productId = '111111111111111111111111'
    const otherProductId = '999999999999999999999999'
    const rows = []
    const notifications = []
    const deletedPhotos = []
    const invalidations = []
    const uploadClaims = [], uploadCleanups = []
    let deny = false
    let createFails = false
    let nextId = 1
    const matches = (row, filter) => Object.entries(filter).every(([key, value]) => {
      if (value && typeof value === 'object') {
        if ('$in' in value) return value.$in.map(String).includes(String(row[key]))
        if ('$ne' in value) return row[key] !== value.$ne
      }
      return value === null ? row[key] == null : String(row[key]) === String(value)
    })
    const query = (value) => ({ select() { return this }, sort() { return this }, skip() { return this }, limit() { return this }, lean: async () => value })
    const model = {
      find: (filter) => query(rows.filter(row => matches(row, filter)).map(row => ({...row}))),
      findOne: (filter) => query(rows.find(row => matches(row, filter)) ?? null),
      findById: (id) => query(rows.find(row => row._id === id) ?? null),
      exists: async (filter) => rows.find(row => matches(row, filter)) ?? null,
      create: async (data) => {
        if (createFails) throw new Error('Database write failed')
        const row = { _id: String(nextId++).padStart(24, '0'), createdAt: new Date(), photos: [], parentId: null, ...data }
        rows.push(row); return row
      },
      updateOne: async (filter, change) => Object.assign(rows.find(row => matches(row, filter)), change.$set),
      findOneAndUpdate: (filter, change) => {
        const row = rows.find(row => matches(row, filter))
        if (row) Object.assign(row, change.$set)
        return query(row ?? null)
      },
      deleteOne: async (filter) => { const index = rows.findIndex(row => matches(row, filter)); if (index !== -1) rows.splice(index, 1) },
      deleteMany: async (filter) => { for (let i = rows.length - 1; i >= 0; i--) if (matches(rows[i], filter)) rows.splice(i, 1) },
      countDocuments: async (filter) => rows.filter(row => matches(row, filter)).length,
    }
    const products = [{ _id: productId, name: { uk: 'Яловичина' }, slug: 'beef' }, { _id: otherProductId, name: { uk: 'Курятина' }, slug: 'chicken' }]
    mock.module('@/server/connect-to-db.server', () => ({ connectToDbServer: async () => {} }))
    mock.module('@/server/auth/require-admin.server', () => ({ requirePermission: async (permission) => { assert.equal(permission, 'reviews:manage'); if (deny) throw new Error('Denied'); return { id: '444444444444444444444444', name: 'Store manager' } } }))
    mock.module('@/server/products/product-schema.server', () => ({ Product: { findById: (id) => query(products.find(p => p._id === String(id)) ?? null), find: () => query(products) } }))
    mock.module('@/server/reviews/review-schema.server', () => ({ ProductReviewModel: model }))
    mock.module('@/server/reviews/review-photos.server', () => ({ uploadReviewPhotos: async files => files.map(() => ({ publicId: 'stored-photo', url: 'private' })), deleteReviewPhotos: async photos => { deletedPhotos.push(...photos) } }))
    mock.module('@/server/reviews/review-notification.server', () => ({ sendProductReviewNotification: async data => { notifications.push(data) } }))
    mock.module('@/server/reviews/review-uploads.server', () => ({
      claimReviewUpload: async (...args) => { uploadClaims.push(args); return [new File(['image'], 'photo.heic', {type:'image/heic'})] },
      deleteReviewUpload: async (...args) => { uploadCleanups.push(args) },
    }))
    mock.module('next/cache', () => ({ revalidatePath: (...args) => invalidations.push(args) }))
    const api = await import('./src/server/reviews/product-reviews.server.ts')
    const form = (overrides = {}) => {
      const result = new FormData()
      for (const [key, value] of Object.entries({ productId, author: 'Guest', text: 'Good', rating: '4', ...overrides })) if (value != null) result.set(key, value)
      return result
    }
    const reviewForm = form()
    reviewForm.append('photos', new File(['image'], 'image.jpg', { type: 'image/jpeg' }))
    await api.submitProductReview(reviewForm)
    const id = rows[0]._id
    assert.equal(rows[0].status, 'pending')
    assert.equal(rows[0].isStoreRepresentative, false)
    assert.equal(notifications.length, 1)
    assert.equal((await api.getProductReviews(productId)).ratingCount, 0)
    await assert.rejects(() => api.submitProductReview(form({ parentId: id, rating: null })))
    await api.moderateProductReview(id, 'approved')
    assert.equal((await api.getProductReviews(productId)).averageRating, 4)
    await assert.rejects(() => api.submitProductReview(form({ productId: otherProductId, parentId: id, rating: null })))
    await api.submitProductReview(form({ parentId: id, rating: null }))
    const replyId = rows[1]._id
    assert.equal((await api.getProductReviews(productId)).reviews[0].replies.length, 0)
    await api.moderateProductReview(replyId, 'approved')
    assert.equal((await api.getProductReviews(productId)).reviews[0].replies.length, 1)
    assert.equal((await api.getProductReviews(productId)).ratingCount, 1)
    await assert.rejects(() => api.submitProductReview(form({ parentId: replyId, rating: null })))
    await api.replyAsStore(id, 'Дякуємо!')
    assert.equal(rows[2].isStoreRepresentative, true)
    assert.equal(rows[2].status, 'pending')
    for (const status of ['hidden', 'rejected', 'pending']) {
      await api.moderateProductReview(id, status)
      assert.equal((await api.getProductReviews(productId)).ratingCount, 0)
      await assert.rejects(() => api.moderateProductReview(replyId, 'approved'))
    }
    deny = true
    for (const operation of [() => api.getAdminProductReviews(new URLSearchParams()), () => api.moderateProductReview(id, 'approved'), () => api.deleteProductReview(id), () => api.replyAsStore(id, 'test')]) await assert.rejects(operation)
    deny = false
    const listed = await api.getAdminProductReviews(new URLSearchParams('status=all'))
    assert.equal(listed.total, 3)
    assert.equal(listed.items[1].parentText, 'Good')
    assert.ok(!JSON.stringify(listed).includes('private'))
    createFails = true
    await assert.rejects(() => api.submitProductReview(reviewForm))
    assert.equal(deletedPhotos.length, 1)
    createFails = false
    await api.deleteProductReview(id)
    assert.equal(rows.length, 0)
    assert.equal(deletedPhotos.length, 2)
    assert.ok(invalidations.length >= 5)
    const uploadedForm = form({ uploadId: 'a'.repeat(32), uploadToken: 'b'.repeat(64) })
    await api.submitProductReview(uploadedForm)
    assert.deepEqual(uploadClaims[0], ['a'.repeat(32), 'b'.repeat(64), productId])
    assert.deepEqual(uploadCleanups[0], ['a'.repeat(32), 'b'.repeat(64)])
    assert.equal(rows[0].photos.length, 1)
    assert.equal(rows[0].status, 'pending')
    createFails = true
    await assert.rejects(() => api.submitProductReview(uploadedForm))
    assert.equal(uploadCleanups.length, 2, 'failed submissions also remove original staged bytes')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test('bounded requests reject oversized streams and cross-origin writes, and durable rate limits reject repeated requests', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    mock.module('@/server/connect-to-db.server', () => ({ connectToDbServer: async () => {} }))
    const counters = new Map()
    mock.module('@/server/reviews/review-schema.server', () => ({ ReviewRateLimit: {
      findOneAndUpdate: async (filter, change, options) => {
        assert.equal(options.upsert, true)
        assert.equal(change.$inc.count, 1)
        assert.ok(change.$setOnInsert.expiresAt instanceof Date)
        const count = counters.get(filter._id) || 0
        if (count >= filter.count.$lt) throw { code: 11000 }
        counters.set(filter._id, count + 1)
      }
    } }))
    const { readReviewForm, readReviewJson, requireReviewOrigin, limitReviewSubmission } = await import('./src/server/reviews/review-request.server.ts')
    const request = (body, headers = {}) => new Request('https://shop.example/api/product-reviews', { method: 'POST', body, headers: { Origin: 'https://shop.example', ...headers } })
    assert.doesNotThrow(() => requireReviewOrigin(request('x')))
    assert.throws(() => requireReviewOrigin(request('x', { Origin: 'https://evil.example' })))
    await assert.rejects(() => readReviewForm(request('x', { 'Content-Type': 'multipart/form-data; boundary=example', 'Content-Length': String(5 * 1024 * 1024) })), error => error.statusCode === 413)
    await assert.rejects(() => readReviewForm(request(new Uint8Array(4 * 1024 * 1024 + 1), { 'Content-Type': 'multipart/form-data; boundary=example' })), error => error.statusCode === 413)
    await assert.rejects(() => readReviewForm(request('x', { 'Content-Type': 'text/plain' })), error => error.statusCode === 415)
    await assert.rejects(() => readReviewJson(request('[]', { 'Content-Type': 'application/json' })), error => error.statusCode === 400)
    assert.deepEqual(await readReviewJson(request('{"status":"approved"}', { 'Content-Type': 'application/json' })), { status: 'approved' })
    process.env.VERCEL = '1'
    for (let i = 0; i < 5; i++) await limitReviewSubmission(request('', { 'x-vercel-forwarded-for': '192.0.2.1' }))
    await assert.rejects(() => limitReviewSubmission(request('', { 'x-vercel-forwarded-for': '192.0.2.1' })), error => error.statusCode === 429)
    assert.ok([...counters.keys()].every(key => !key.includes('192.0.2.1')))
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test('database validation rejects malformed roots and reply ratings even outside the request parser', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    // BSON checks V8 snapshot state; Bun 1.3 exposes a throwing placeholder.
    process.getBuiltinModule('v8').startupSnapshot.isBuildingSnapshot = () => false
    const { ProductReviewModel } = await import('./src/server/reviews/review-schema.server.ts')
    const base = { productId: '111111111111111111111111', author: 'Guest', text: 'Good' }
    await new ProductReviewModel({ ...base, rating: 5 }).validate()
    await new ProductReviewModel({ ...base, parentId: '222222222222222222222222' }).validate()
    for (const rating of [undefined, 0, 6, 4.5]) await assert.rejects(() => new ProductReviewModel({ ...base, rating }).validate())
    await assert.rejects(() => new ProductReviewModel({ ...base, parentId: '222222222222222222222222', rating: 5 }).validate())
    await assert.rejects(() => new ProductReviewModel({ ...base, parentId: '222222222222222222222222', photos: [{ publicId: 'id', url: 'url' }] }).validate())
    assert.equal(new ProductReviewModel({ ...base, rating: 5 }).status, 'pending')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test('review Telegram notifications send once without raw photo links and absorb transport failures', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    process.env.TELEGRAM_BOT_TOKEN = '123456:test-token'
    process.env.TELEGRAM_BOT_CHAT_ID = '-100123456789'
    const requests = []
    let fail = false
    const logs = []
    console.error = (...args) => logs.push(args)
    globalThis.fetch = async (input, init) => {
      const request = new Request(input, init)
      assert.equal(request.url, 'https://api.telegram.org/bot123456:test-token/sendMessage')
      const form = await request.formData()
      requests.push({ chat: form.get('chat_id'), text: form.get('text') })
      if (fail) throw new Error('Transport error containing sensitive URL')
      return Response.json({ ok: true, result: { message_id: 1, date: 0, chat: { id: -100123456789, type: 'group' }, text: 'sent' } })
    }
    const { sendProductReviewNotification } = await import('./src/server/reviews/review-notification.server.ts')
    const review = { productName: 'Яловичина', author: '<Guest>', text: '<script>plain text</script>', rating: 4, photoCount: 3, isReply: false }
    await sendProductReviewNotification(review)
    assert.equal(requests.length, 1)
    assert.equal(requests[0].chat, '-100123456789')
    for (const text of ['Яловичина', '<Guest>', '<script>plain text</script>', '4/5', 'ФОТО: 3', '/uk/admin/reviews']) assert.ok(requests[0].text.includes(text))
    assert.ok(!requests[0].text.includes('cloudinary'))
    fail = true
    await sendProductReviewNotification({ ...review, isReply: true, rating: undefined })
    assert.equal(requests.length, 2)
    assert.equal(logs.length, 1)
    assert.ok(!JSON.stringify(logs).includes('sensitive'))
    delete process.env.TELEGRAM_BOT_TOKEN
    await sendProductReviewNotification(review)
    assert.equal(requests.length, 2)
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
