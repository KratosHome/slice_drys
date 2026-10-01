import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { getProductPrice, isProductPriceReduced } from './product-price'
import { getProductVariant, productVariantUrl } from './product-variant'

describe('product purchase consistency', () => {
  const variables: IVariableProduct[] = [
    { weight: 30, price: 100, currency: 'грн', count: 10 },
    { weight: 150, price: 415, newPrice: 457, currency: 'грн', count: 5 },
  ]

  test('150 g selection survives the catalog to product URL', () => {
    const url = productVariantUrl('/uk/products/meat/product/beef', 150)
    const weight = new URL(url, 'https://example.test').searchParams.get(
      'weight',
    )
    const selected = getProductVariant({ variables }, weight)

    assert.equal(selected.weight, 150)
    assert.equal(getProductPrice(selected), 457)
    assert.equal(isProductPriceReduced(selected), false)
  })

  test('switching weight preserves advertising query parameters', () => {
    const url = productVariantUrl(
      '/uk/products/meat/product/beef?utm_source=google&gclid=campaign&weight=30',
      150,
    )
    const params = new URL(url, 'https://example.test').searchParams

    assert.equal(params.get('weight'), '150')
    assert.equal(params.get('utm_source'), 'google')
    assert.equal(params.get('gclid'), 'campaign')
  })

  test('URL changes select the matching variant rather than retained local state', () => {
    assert.equal(getProductVariant({ variables }, '150').weight, 150)
    assert.equal(getProductVariant({ variables }, '30').weight, 30)
    assert.equal(getProductVariant({ variables }, 'invalid').weight, 30)
    assert.equal(
      getProductVariant({ variables, variant: variables[1] }).weight,
      150,
    )
  })

  test('uses a valid current price and displays a reduction only for a lower price', () => {
    assert.equal(getProductPrice({ price: 415, newPrice: 380 }), 380)
    assert.equal(isProductPriceReduced({ price: 415, newPrice: 380 }), true)
    assert.equal(getProductPrice({ price: 415, newPrice: 0 }), 415)
    assert.equal(getProductPrice({ price: 415, newPrice: NaN }), 415)
    assert.equal(getProductPrice({ price: 415, newPrice: Infinity }), 415)
    assert.equal(getProductPrice({ price: -5, newPrice: null }), undefined)
    assert.equal(getProductPrice({ price: 0, newPrice: 457 }), 457)
  })
})
