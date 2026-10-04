import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toProductCard } from './product-card'
import { getProductVariant, productVariantUrl } from './product-variant'
import { getProductPrice } from './product-price'
import { getProductAnalyticsItem } from './analytics'

test('compact cards preserve selected variant, purchase price, stock and analytics', () => {
  const product = {
    _id: 'beef',
    name: 'Beef',
    img: '/beef.webp',
    slug: 'beef',
    category: 'meat',
    statusLabel: ['sale'],
    description: 'Full article kept on the server',
    nutritionalValue: { proteins: '20' },
    visited: 100,
    variables: [
      { _id: 1, weight: 30, price: 100, currency: 'UAH', count: 8, sold: 20 },
      {
        _id: 2,
        weight: 150,
        price: 500,
        newPrice: 457,
        currency: 'UAH',
        count: 4,
        sold: 50,
      },
    ],
  } as IProduct
  product.variant = product.variables[1]
  const before = JSON.stringify(product)
  const card = toProductCard(product)
  const selected = getProductVariant(card)

  assert.equal(selected.weight, 150)
  assert.equal(selected.count, 4)
  assert.equal(getProductPrice(selected), 457)
  assert.equal(
    productVariantUrl('/uk/products/meat/product/beef', selected.weight),
    '/uk/products/meat/product/beef?weight=150',
  )
  assert.deepEqual(
    getProductAnalyticsItem(card, selected),
    getProductAnalyticsItem(product, product.variant),
  )
  assert.equal(
    JSON.stringify(product),
    before,
    'full server record stays available for JSON-LD and product detail',
  )
  assert.ok(!JSON.stringify(card).includes('Full article'))
  assert.ok(!('nutritionalValue' in card))
  assert.ok(!('visited' in card))
  assert.ok(card.variables.every((variable) => !('sold' in variable)))
})
