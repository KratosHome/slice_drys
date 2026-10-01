import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  findByProductSlug,
  normalizeProductSlug,
  productSlugPattern,
} from './product-slug'

describe('product slug lookup', () => {
  test('resolves a legacy Grapefruit record from its lowercase canonical URL', async () => {
    const product = { slug: 'Grapefruit' }
    const queries: Array<string | RegExp> = []
    const result = await findByProductSlug('grapefruit', async (query) => {
      queries.push(query)
      return typeof query === 'string'
        ? product.slug === query
          ? product
          : null
        : query.test(product.slug)
          ? product
          : null
    })

    assert.equal(result, product)
    assert.equal(queries[0], 'grapefruit')
    assert.equal(queries.length, 2)
    assert.equal(normalizeProductSlug(result!.slug), 'grapefruit')
  })

  test('prefers the exact lowercase record without a fallback query', async () => {
    const canonicalProduct = { slug: 'grapefruit' }
    const queries: Array<string | RegExp> = []
    const result = await findByProductSlug(' Grapefruit ', async (query) => {
      queries.push(query)
      return canonicalProduct
    })

    assert.equal(result, canonicalProduct)
    assert.deepEqual(queries, ['grapefruit'])
  })

  test('treats regex characters literally and never matches another slug', () => {
    const pattern = productSlugPattern('Grape.*fruit+(test)[1]$')

    assert.equal(pattern.test('Grape.*fruit+(test)[1]$'), true)
    assert.equal(pattern.test('grape-other-fruit-test-1'), false)
    assert.equal(productSlugPattern('grapefruit').test('grapefruit-mix'), false)
    assert.equal(productSlugPattern('grapefruit').test('Grapefruit'), true)
  })

  test('does not look up an empty slug', async () => {
    let queries = 0
    const result = await findByProductSlug(' ', async () => {
      queries += 1
      return { slug: 'grapefruit' }
    })

    assert.equal(result, null)
    assert.equal(queries, 0)
  })
})
