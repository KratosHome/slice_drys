import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { NextRequest } from 'next/server'
import { buildCustomRoute } from 'next/dist/lib/build-custom-route'
import nextConfig from '../next.config.mjs'

import { proxy } from './proxy'

const legacyDestinations = {
  meat: '/products/meat',
  fruits: '/products/fruits',
  vegetables: '/products/vegetables',
  mixes: '/products/mixes',
  promotions: '/products/promotions',
  beef: '/products/meat/beef',
  turkey: '/products/meat/turkey',
  pork: '/products/meat/pork',
  chicken: '/products/meat/chicken',
  plum: '/products/fruits/plum',
  apple: '/products/fruits/apple',
  strawberry: '/products/fruits/strawberry',
  kiwi: '/products/fruits/kiwi',
  banana: '/products/fruits/banana',
  orange: '/products/fruits/orange',
  tangerine: '/products/fruits/tangerine',
  grapefruit: '/products/fruits/grapefruit',
  lemon: '/products/fruits/lemon',
  persimmon: '/products/fruits/persimmon',
  pumpkin: '/products/vegetables/pumpkin',
  tomato: '/products/vegetables/tomato',
  beetroot: '/products/vegetables/beetroot',
  carrot: '/products/vegetables/carrot',
}

describe('legacy category redirects', () => {
  for (const [slug, targetPath] of Object.entries(legacyDestinations)) {
    test(`${slug} redirects straight to its current category in either language`, async () => {
      const redirects = await nextConfig.redirects!()
      const compiled = redirects.map((route) => ({
        ...route,
        pattern: new RegExp(
          buildCustomRoute('redirect', route, ['/_next']).regex,
          'i',
        ),
      }))

      for (const prefix of ['', '/uk', '/en', '/EN']) {
        const locale = prefix.toLowerCase() === '/en' ? 'en' : 'uk'
        for (const suffix of ['', '/']) {
          const path = `${prefix}/${slug}${suffix}`
          const expected = `/${locale}${targetPath}`
          const response = await proxy(
            new NextRequest(
              `https://slicedrys.com${path}?utm_source=old-link&weight=150`,
            ),
          )
          assert.equal(response.status, 308)
          assert.equal(
            response.headers.get('location'),
            `https://slicedrys.com${expected}?utm_source=old-link&weight=150`,
          )

          // Test Next's actual rule compiler and ordering: the slash cleanup
          // must not intercept an old URL before its final destination.
          const firstMatch = compiled.find((rule) => rule.pattern.test(path))
          assert.equal(firstMatch?.destination, expected)
          assert.equal(firstMatch?.permanent, true)
        }
      }
    })
  }

  test('legacy paths reach routing before the usual slash cleanup', async () => {
    assert.equal(nextConfig.skipTrailingSlashRedirect, true)
    const redirects = await nextConfig.redirects!()
    assert.deepEqual(redirects.at(-1), {
      source: '/:path+/',
      destination: '/:path+',
      permanent: true,
    })
  })

  test('current categories and unknown old names do not get legacy redirects', async () => {
    for (const path of [
      '/uk/products/meat',
      '/en/products/fruits',
      '/uk/products/meat/turkey',
      '/uk/unknown-old-category',
      '/uk/constructor',
    ]) {
      const response = await proxy(
        new NextRequest(`https://slicedrys.com${path}`),
      )
      assert.equal(response.headers.get('location'), null)
    }
  })
})
