import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import metadata from '../../scripts/fonts/rubik-doodle-shadow/subset.json'
import loading from './rubik-doodle-shadow-loading.json'
import {
  getRubikFontProfile,
  hasUncoveredCharacters,
} from './rubik-font-profile'

function codepoints(ranges: string) {
  return ranges.split(',').flatMap((range) => {
    const [start, end = start] = range.replace('U+', '').split('-')
    const first = parseInt(start, 16)
    return Array.from(
      { length: parseInt(end, 16) - first + 1 },
      (_, index) => first + index,
    )
  })
}

test('critical font profiles cover both locales and preserve full coverage on other pages', () => {
  for (const locale of ['uk', 'en']) {
    assert.equal(getRubikFontProfile(`/${locale}/`, locale), 'home')
    assert.equal(getRubikFontProfile(`/${locale}/blog`, locale), 'headings')
    assert.equal(
      getRubikFontProfile(`/${locale}/products/meat/dried`, locale),
      'headings',
    )
    assert.equal(
      getRubikFontProfile(`/${locale}/products/meat/product/pork`, locale),
      'controls',
    )
    assert.equal(
      getRubikFontProfile(`/${locale}/blog/a-post`, locale),
      'controls',
    )
    assert.equal(getRubikFontProfile(`/${locale}/contacts`, locale), 'full')
    assert.equal(
      getRubikFontProfile(`/${locale}/admin/products`, locale),
      'full',
    )
  }
})

test('every progressive font family preserves the complete disjoint character coverage', () => {
  const complete = new Set(
    metadata.faces.flatMap((face) => codepoints(face.unicodeRanges)),
  )
  assert.equal(complete.size, 227)
  for (const faces of [
    metadata.inner.faces,
    ...(['uk', 'en'] as const).map((locale) =>
      metadata.progressive.faces.filter((face) =>
        metadata.progressive.localeFaces[locale].includes(face.name),
      ),
    ),
  ]) {
    const characters = faces.flatMap((face) => codepoints(face.unicodeRanges))
    assert.equal(
      characters.length,
      new Set(characters).size,
      'CSS ranges must not overlap',
    )
    assert.deepEqual(new Set(characters), complete)
  }
})

test('visible blog and filter text plus controls never require the remaining alphabet', () => {
  for (const locale of ['uk', 'en'] as const) {
    const messages = JSON.parse(readFileSync(`local/${locale}.json`, 'utf8'))
    const initial = loading.inner[locale]
    const covered = new Set(
      initial.controlsCharacters + initial.headingCharacters,
    )
    for (const text of [
      messages.blog.title,
      messages['product-list'].type,
      messages['product-list'].weight,
      messages['product-list'].filter,
      '+ - > < 0123456789',
    ])
      assert.equal(hasUncoveredCharacters(text, covered), false, text)
    const controlsOnly = new Set(initial.controlsCharacters)
    assert.equal(
      hasUncoveredCharacters(messages.blog.title, controlsOnly),
      true,
    )
  }
  const numeric = metadata.inner.faces.find((face) => face.name === 'numeric')!
  const punctuation = metadata.inner.faces.find(
    (face) => face.name === 'punctuation',
  )!
  assert.deepEqual(
    codepoints(numeric.unicodeRanges),
    Array.from({ length: 10 }, (_, index) => 48 + index),
  )
  assert.equal(
    codepoints(punctuation.unicodeRanges).some(
      (code) => code >= 48 && code <= 57,
    ),
    false,
  )
})

test('generated font assets match their immutable filenames and all loading stylesheets exist', () => {
  for (const face of [
    ...metadata.faces,
    ...metadata.progressive.faces,
    ...metadata.inner.faces,
  ]) {
    const data = readFileSync(`public/fonts/rubik-doodle-shadow/${face.file}`)
    assert.equal(data.byteLength, face.bytes)
    assert.equal(createHash('sha256').update(data).digest('hex'), face.sha256)
    assert.ok(face.file.includes(face.sha256.slice(0, 12)))
  }
  for (const href of [
    loading.full,
    ...Object.values(loading.home).map((entry) => entry.remaining),
    ...Object.values(loading.inner).map((entry) => entry.remaining),
  ]) {
    const css = readFileSync(`public${href}`, 'utf8')
    assert.ok(css.includes('font-display: swap'))
    for (const [, asset] of css.matchAll(/url\("([^"]+)"\)/g)) {
      assert.ok(readFileSync(`public${asset}`).byteLength > 0)
    }
  }
})
