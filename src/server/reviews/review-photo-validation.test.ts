import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { sanitizeReviewPhotos } from './review-photo-validation'
import { REVIEW_MAX_PHOTO_BYTES } from '@/constants/product-review'

function file(bytes: Uint8Array, type: string, name = 'untrusted-name.jpg') {
  return new File([new Uint8Array(bytes)], name, { type })
}

test('re-encodes images, applies orientation, and removes private metadata before storage', async () => {
  const original = await sharp({
    create: { width: 12, height: 8, channels: 3, background: '#ff0000' },
  })
    .withMetadata({ orientation: 6 })
    .withExifMerge({
      IFD0: { Artist: 'Private photographer', Copyright: 'Private metadata' },
    })
    .jpeg()
    .toBuffer()
  assert.ok((await sharp(original).metadata()).exif)
  const [sanitized] = await sanitizeReviewPhotos([file(original, 'image/jpeg')])
  const metadata = await sharp(sanitized).metadata()
  assert.equal(metadata.format, 'webp')
  assert.equal(metadata.width, 8)
  assert.equal(metadata.height, 12)
  for (const field of ['exif', 'xmp', 'iptc', 'icc', 'orientation'] as const) {
    assert.equal(metadata[field], undefined, field)
  }
  assert.equal(sanitized.includes(Buffer.from('Private')), false)
})

test('rejects excess count, oversize, empty, SVG, spoofed MIME and broken image content', async () => {
  const png = await sharp({
    create: { width: 2, height: 2, channels: 3, background: 'red' },
  })
    .png()
    .toBuffer()
  const valid = file(png, 'image/png')
  const invalid = [
    [valid, valid, valid, valid],
    [file(new Uint8Array(REVIEW_MAX_PHOTO_BYTES + 1), 'image/png')],
    [file(new Uint8Array(), 'image/png')],
    [
      file(
        Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
        'image/svg+xml',
      ),
    ],
    [
      file(
        Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
        'image/png',
      ),
    ],
    [file(png, 'image/jpeg')],
    [file(Buffer.from([0xff, 0xd8, 0xff, 0, 0, 0]), 'image/jpeg')],
  ]
  for (const files of invalid) {
    await assert.rejects(sanitizeReviewPhotos(files), { statusCode: 400 })
  }
  assert.equal((await sanitizeReviewPhotos([valid, valid, valid])).length, 3)
})

test('limits decoded pixels and resizes large photos', async () => {
  const giant = await sharp({
    create: { width: 8000, height: 8000, channels: 3, background: 'white' },
  })
    .png()
    .toBuffer()
  await assert.rejects(sanitizeReviewPhotos([file(giant, 'image/png')]), {
    statusCode: 400,
  })
  const large = await sharp({
    create: { width: 2400, height: 1200, channels: 3, background: 'white' },
  })
    .webp()
    .toBuffer()
  const [sanitized] = await sanitizeReviewPhotos([file(large, 'image/webp')])
  const metadata = await sharp(sanitized).metadata()
  assert.equal(metadata.width, 2048)
  assert.equal(metadata.height, 1024)
})

test('decodes actual HEIC and HEIF originals, including blank MIME, and strips container metadata', async () => {
  const original = await readFile(
    new URL('./__fixtures__/example.heic', import.meta.url),
  )
  for (const [type, name] of [
    ['image/heic', 'photo.heic'],
    ['image/heif', 'photo.heif'],
    ['', 'photo.heif'],
    ['application/octet-stream', 'photo.heic'],
  ]) {
    const [sanitized] = await sanitizeReviewPhotos([file(original, type, name)])
    const metadata = await sharp(sanitized).metadata()
    assert.equal(metadata.format, 'webp')
    assert.equal(metadata.width, 1280)
    assert.equal(metadata.height, 854)
    assert.equal(metadata.exif, undefined)
    assert.equal(metadata.xmp, undefined)
    assert.equal(metadata.icc, undefined)
    assert.notDeepEqual(sanitized, original)
  }
})

test('accepts a real HEIC original at the 20 MiB boundary and rejects corrupt HEIF', async () => {
  const original = await readFile(
    new URL('./__fixtures__/example.heic', import.meta.url),
  )
  // Add a legal ISO-BMFF free-space box so the fixture exercises the original
  // byte-size boundary without requiring a huge decoded image in the suite.
  const padded = Buffer.alloc(REVIEW_MAX_PHOTO_BYTES)
  original.copy(padded)
  padded.writeUInt32BE(padded.length - original.length, original.length)
  padded.write('free', original.length + 4, 'ascii')
  const [sanitized] = await sanitizeReviewPhotos([
    file(padded, 'image/heic', 'large.heic'),
  ])
  assert.equal((await sharp(sanitized).metadata()).width, 1280)
  await assert.rejects(
    sanitizeReviewPhotos([
      file(original.subarray(0, 32), 'image/heic', 'broken.heic'),
    ]),
    { statusCode: 400 },
  )
  await assert.rejects(
    sanitizeReviewPhotos([file(Buffer.from('<svg/>'), '', 'disguised.heif')]),
    { statusCode: 400 },
  )
})
