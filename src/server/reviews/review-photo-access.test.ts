import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('private review photos require approval or moderator access, and cannot be cached after hiding', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    const { ApiError } = await import('./src/server/api-error.server.ts')
    let status = 'pending', admin = false, exists = true, isReply = false
    let fetches = 0, checks = 0
    mock.module('@/server/connect-to-db.server', () => ({ connectToDbServer: async () => {} }))
    mock.module('@/server/auth/require-admin.server', () => ({
      requirePermission: async permission => {
        assert.equal(permission, 'reviews:manage'); checks++
        if (!admin) throw new ApiError(401, 'Authentication required')
        return { id: 'moderator' }
      },
    }))
    mock.module('@/server/reviews/review-schema.server', () => ({ ProductReviewModel: {
      findById: () => ({ select: () => ({ lean: async () => exists ? {
        status, parentId: isReply ? 'parent' : null,
        photos: [{ publicId: 'owned-asset', url: 'https://untrusted.example/not-used' }],
      } : null }) }),
    } }))
    mock.module('@/server/reviews/review-photos.server', () => ({
      reviewPhotoDeliveryUrl: id => { assert.equal(id, 'owned-asset'); return 'https://res.cloudinary.com/test/image/authenticated/signed.webp' },
    }))
    globalThis.fetch = async url => {
      assert.equal(url, 'https://res.cloudinary.com/test/image/authenticated/signed.webp')
      fetches++
      return new Response(new Uint8Array([1,2,3]), { status: 200 })
    }
    const { GET } = await import('./src/app/api/product-review-photos/[reviewId]/[photoIndex]/route.ts')
    const read = (photoIndex = '0', reviewId = '012345678901234567890123') => GET(new Request('https://slicedrys.com/api/photo'), { params: Promise.resolve({ reviewId, photoIndex }) })
    for (status of ['pending', 'rejected', 'hidden']) {
      assert.equal((await read()).status, 404)
    }
    assert.equal(fetches, 0)
    admin = true
    const preview = await read()
    assert.equal(preview.status, 200)
    assert.equal(preview.headers.get('content-type'), 'image/webp')
    assert.match(preview.headers.get('cache-control'), /private, no-store/)
    assert.equal(preview.headers.get('x-content-type-options'), 'nosniff')
    admin = false; status = 'approved'
    const before = checks
    assert.equal((await read()).status, 200)
    assert.equal(checks, before, 'approved photos are public without admin lookup')
    status = 'hidden'
    assert.equal((await read()).status, 404, 'hiding immediately revokes public photo access')
    status = 'approved'; exists = false
    assert.equal((await read()).status, 404)
    exists = true; isReply = true
    assert.equal((await read()).status, 404, 'replies never expose photos')
    isReply = false
    assert.equal((await read('1')).status, 404)
    assert.equal((await read('999')).status, 404)
    assert.equal((await read('0', '../invalid')).status, 404)
    assert.equal(fetches, 2)
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test('photo uploads are private, sanitized, validated before storage, and rolled back on partial failure', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { Writable } from 'node:stream'
    import { mock } from 'bun:test'
    import sharp from 'sharp'
    mock.module('server-only', () => ({}))
    const uploaded = [], destroyed = []
    let shouldFail = false, attempts = 0
    mock.module('@/server/cloudinary-config.server', () => ({ default: {
      url: (id, options) => { assert.equal(options.type, 'authenticated'); assert.equal(options.sign_url, true); return 'signed:' + id },
      uploader: {
        upload_stream: (options, callback) => new Writable({
          write: (bytes, encoding, done) => {
            attempts++
            assert.equal(options.type, 'authenticated')
            assert.equal(options.resource_type, 'image')
            assert.equal(options.overwrite, false)
            if (shouldFail && attempts === 2) callback(new Error('Storage failure'))
            else { uploaded.push({ bytes, options }); callback(null, { public_id: options.public_id }) }
            done()
          },
        }),
        destroy: async (id, options) => {
          assert.equal(options.type, 'authenticated')
          assert.equal(options.invalidate, true)
          destroyed.push(id); return { result: 'ok' }
        },
      },
    } }))
    const { uploadReviewPhotos, deleteReviewPhotos } = await import('./src/server/reviews/review-photos.server.ts')
    const bytes = await sharp({ create: { width: 10, height: 10, channels: 3, background: 'red' } }).withMetadata().jpeg().toBuffer()
    const file = () => new File([bytes], 'private.jpg', { type: 'image/jpeg' })
    await assert.rejects(uploadReviewPhotos([file(), new File(['svg'], 'fake.jpg', {type:'image/jpeg'})]))
    assert.equal(attempts, 0, 'bad batch never touches storage')
    shouldFail = true
    await assert.rejects(uploadReviewPhotos([file(), file()]))
    assert.equal(destroyed.length, 1)
    assert.equal(destroyed[0], uploaded[0].options.public_id)
    const metadata = await sharp(uploaded[0].bytes).metadata()
    assert.equal(metadata.format, 'webp')
    assert.equal(metadata.exif, undefined)
    assert.equal(metadata.icc, undefined)
    shouldFail = false
    const photos = await uploadReviewPhotos([file()])
    assert.equal(photos.length, 1)
    await deleteReviewPhotos(photos)
    assert.equal(destroyed.at(-1), photos[0].publicId)
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
