import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { parse } from 'node:url'
import { NextRequest } from 'next/server'
import { buildCustomRoute } from 'next/dist/lib/build-custom-route'
import { prepareDestination } from 'next/dist/shared/lib/router/utils/prepare-destination'
import nextConfig from '../next.config.mjs'
import verifiedRules from './data/__fixtures__/missing-redirect-rules-2026-11-05.json'
import { proxy } from './proxy'

const origin = 'https://slicedrys.com'
const redirects = await nextConfig.redirects!()
const compiled = redirects.map((route) => ({
  ...route,
  pattern: new RegExp(
    buildCustomRoute('redirect', route, ['/_next']).regex,
    'i',
  ),
}))

async function assertProductRedirect(source: string, destination: string) {
  const url = new URL(source)
  const response = await proxy(new NextRequest(url))
  assert.equal(response.status, 308, source)
  assert.equal(
    response.headers.get('location'),
    `${url.origin}${destination}${url.search}`,
    source,
  )

  // Config redirects run before proxy and slash normalization. Check the
  // actual first match, then Next's query forwarding using the audited target.
  const firstMatch = compiled.find((rule) => rule.pattern.test(url.pathname))
  assert.ok(firstMatch, source)
  assert.equal(firstMatch.destination, destination, source)
  assert.equal(firstMatch.permanent, true, source)
  const query = parse(source, true).query
  const { newUrl, parsedDestination } = prepareDestination({
    appendParamsToQuery: false,
    destination: firstMatch.destination,
    params: {},
    query,
  })
  assert.equal(newUrl, destination, source)
  assert.deepEqual(parsedDestination.query, { ...query }, source)
}

describe('verified Search Console redirects (2026-11-05)', () => {
  test('the independent audit fixture contains all 50 rules and 73 URLs', () => {
    assert.equal(verifiedRules.length, 50)
    assert.equal(new Set(verifiedRules.map((rule) => rule.source)).size, 50)
    const urls = verifiedRules.flatMap((rule) => rule.exact_source_urls)
    assert.equal(urls.length, 73)
    assert.equal(new Set(urls).size, 73)
  })

  for (const rule of verifiedRules) {
    test(`${rule.source} reaches the verified product with every observed query`, async () => {
      const sources = new Set([
        `${origin}${rule.source}`,
        ...rule.exact_source_urls,
      ])
      for (const source of sources) {
        await assertProductRedirect(source, rule.destination)
        const withSlash = new URL(source)
        withSlash.pathname += '/'
        await assertProductRedirect(withSlash.href, rule.destination)
      }

      assert.equal(
        compiled.some((entry) => entry.pattern.test(rule.destination)),
        false,
        'the canonical destination must not match another config redirect',
      )
      const destinationResponse = await proxy(
        new NextRequest(`${origin}${rule.destination}`),
      )
      assert.equal(destinationResponse.headers.get('location'), null)
    })
  }

  test('all new paths preserve arbitrary weights, repeated and encoded query values', async () => {
    const query =
      '?weight=98&utm_source=search%20console&tag=a%2Fb&tag=c%26d&empty=&q=%D0%B2%D0%B0%D0%B3%D0%B0&plus=%2B'
    for (const rule of verifiedRules) {
      await assertProductRedirect(
        `${origin}${rule.source}${query}`,
        rule.destination,
      )
    }
  })

  test('unverified paths receive no invented product or homepage destination', async () => {
    const legacyRules = compiled.filter((rule) => rule.source !== '/:path+/')
    for (const path of [
      '/$',
      '/&',
      '/uk/$',
      '/en/$',
      '/category/?page=2',
      '/uk/category/?page=2',
      '/en/category/?page=2',
      '/uk/delivery',
      '/uk/grapefruit/unknown-product',
      '/uk/unknown-category/grapefruit',
      '/uk/meat/pumpkin',
      '/uk/undefined/kiwi',
      '/uk/kiwi/kiwi-strawberry/extra',
    ]) {
      const url = new URL(`${origin}${path}`)
      assert.equal(
        legacyRules.some((rule) => rule.pattern.test(url.pathname)),
        false,
        path,
      )
      const response = await proxy(new NextRequest(url))
      const location = response.headers.get('location')
      if (location) {
        // Existing locale/slash normalization is allowed, but the unresolved
        // route and its query must survive unchanged.
        const normalized = new URL(location)
        const expectedPath = /^\/(uk|en)(\/|$)/.test(url.pathname)
          ? url.pathname
          : `/uk${url.pathname}`
        assert.equal(
          normalized.pathname.replace(/\/$/, ''),
          expectedPath.replace(/\/$/, ''),
          path,
        )
        assert.equal(normalized.search, url.search, path)
      }
    }
  })
})
