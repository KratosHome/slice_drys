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

// Canonical product categories, independently checked against the sitemap.
const legacyProducts = {
  fruits: [
    'apple',
    'apple-with-cinnamon',
    'banana',
    'grapefruit',
    'kiwi',
    'lemon',
    'orange',
    'persimmon',
    'plum',
    'strawberry',
    'tangerine',
  ],
  meat: ['beef', 'chicken', 'pork', 'turkey'],
  mixes: ['banana-strawberry', 'beef-chicken', 'kiwi-strawberry'],
  vegetables: ['beetroot', 'carrot', 'pumpkin', 'tomato'],
}

const legacyProductDestinations = [
  ...Object.entries(legacyProducts).flatMap(([category, slugs]) =>
    slugs.map((slug) => [
      `${category}/${slug}`,
      `/products/${category}/product/${slug}`,
    ]),
  ),
  ['undefined/beef-chicken', '/products/mixes/product/beef-chicken'],
  ['plum/plum', '/products/fruits/product/plum'],
  ['undefined/tangerine', '/products/fruits/product/tangerine'],
  ['meat/beef-chicken', '/products/mixes/product/beef-chicken'],
  ['strawberry/strawberry', '/products/fruits/product/strawberry'],
  ['meat/orange', '/products/fruits/product/orange'],
  ['beef/beef', '/products/meat/product/beef'],
  ['orange/orange', '/products/fruits/product/orange'],
  ['undefined/plum', '/products/fruits/product/plum'],
  ['products/grapefruit', '/products/fruits/product/grapefruit'],
]

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

describe('legacy product redirects', () => {
  for (const [oldPath, targetPath] of legacyProductDestinations) {
    test(`${oldPath} redirects directly to its canonical product`, async () => {
      const redirects = await nextConfig.redirects!()
      const compiled = redirects.map((route) => ({
        ...route,
        pattern: new RegExp(
          buildCustomRoute('redirect', route, ['/_next']).regex,
          'i',
        ),
      }))

      for (const prefix of ['', '/uk', '/en', '/EN', '/UK']) {
        const locale = prefix.toLowerCase() === '/en' ? 'en' : 'uk'
        const expected = `/${locale}${targetPath}`

        for (const spelling of [oldPath, oldPath.toUpperCase()]) {
          for (const suffix of ['', '/']) {
            const path = `${prefix}/${spelling}${suffix}`
            const query =
              '?weight=100&utm_source=old-link&utm_campaign=legacy&tag=a&tag=b'
            const response = await proxy(
              new NextRequest(`https://slicedrys.com${path}${query}`),
            )
            assert.equal(response.status, 308)
            assert.equal(
              response.headers.get('location'),
              `https://slicedrys.com${expected}${query}`,
            )

            // Next config runs before proxy, including slash cleanup.
            const firstMatch = compiled.find((rule) => rule.pattern.test(path))
            assert.equal(firstMatch?.destination, expected)
            assert.equal(firstMatch?.permanent, true)
          }
        }

        assert.equal(
          compiled.find((rule) => rule.pattern.test(expected)),
          undefined,
          'the destination must not match another config redirect',
        )
        const destinationResponse = await proxy(
          new NextRequest(`https://slicedrys.com${expected}`),
        )
        assert.equal(destinationResponse.headers.get('location'), null)
      }
    })
  }

  test('unknown products, mismatched categories and extra segments stay unmatched', async () => {
    const redirects = await nextConfig.redirects!()
    const patterns = redirects.map((route) =>
      new RegExp(buildCustomRoute('redirect', route, ['/_next']).regex, 'i'),
    )

    for (const path of [
      '/en/vegetables/unknown-product',
      '/uk/undefined/unknown-product',
      '/uk/undefined/pumpkin',
      '/en/meat/pumpkin',
      '/en/vegetables/pumpkin/extra',
      '/uk/constructor/beef-chicken',
      '/en/meat/unknown-product',
      '/uk/beef/unknown-product',
      '/en/products/unknown-product',
      '/uk/products/vegetables/product/pumpkin',
      '/en/products/mixes/product/beef-chicken',
    ]) {
      assert.equal(patterns.some((pattern) => pattern.test(path)), false, path)
      const response = await proxy(
        new NextRequest(`https://slicedrys.com${path}`),
      )
      assert.equal(response.headers.get('location'), null, path)
    }
  })

  test('a missing category never gets a product or homepage redirect', async () => {
    const redirects = await nextConfig.redirects!()
    // The existing generic trailing-slash cleanup may still normalize the
    // path; neither it nor locale normalization should invent a destination.
    const legacyRules = redirects.filter((route) => route.source !== '/:path+/')

    for (const path of ['/category', '/uk/category', '/en/category']) {
      for (const suffix of ['', '/']) {
        const url = new URL(`https://slicedrys.com${path}${suffix}?page=2`)
        assert.equal(
          legacyRules.some((route) =>
            new RegExp(
              buildCustomRoute('redirect', route, ['/_next']).regex,
              'i',
            ).test(url.pathname),
          ),
          false,
        )
        const response = await proxy(new NextRequest(url))
        const location = response.headers.get('location')
        if (location) {
          const normalized = new URL(location)
          assert.equal(normalized.pathname.replace(/\/$/, ''), '/uk/category')
          assert.equal(normalized.search, '?page=2')
        }
      }
    }
  })
})
