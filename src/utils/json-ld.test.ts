import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { buildProductNode } from './json-ld'

const canonicalUrl = 'https://slicedrys.com/uk/products/meat/product/beef'

function productWithVariants(variables: IVariableProduct[]): IProduct {
  return {
    _id: 'product-id',
    name: 'Яловичина',
    slug: 'beef',
    category: 'meat',
    description: 'В’ялена яловичина',
    variables,
    menu: [],
    composition: [],
    statusLabel: [],
    categories: ['meat'],
    nutritionalValue: {
      proteins: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
  }
}

type Offer = {
  price: number
  url: string
  priceCurrency: string
  availability: string
}

describe('product structured data', () => {
  test('150 g beef offer matches its displayed 457 UAH price and selects that weight', () => {
    const node = buildProductNode(
      productWithVariants([
        {
          _id: 150,
          weight: 150,
          price: 415,
          newPrice: 457,
          currency: 'грн',
          count: 5,
        },
      ]),
      canonicalUrl,
    )
    const offers = node.offers as Offer[]

    assert.equal(offers[0].price, 457)
    assert.equal(offers[0].priceCurrency, 'UAH')
    assert.equal(offers[0].url, `${canonicalUrl}?weight=150`)
    assert.equal(offers[0].availability, 'https://schema.org/InStock')
  })

  test('publishes current availability and excludes variants without a valid price', () => {
    const node = buildProductNode(
      productWithVariants([
        { weight: 30, price: 95, currency: 'UAH', count: 0 },
        { weight: 50, price: 0, currency: 'UAH', count: 3 },
      ]),
      canonicalUrl,
    )
    const offers = node.offers as Offer[]

    assert.equal(offers.length, 1)
    assert.equal(offers[0].price, 95)
    assert.equal(offers[0].availability, 'https://schema.org/OutOfStock')
  })
})
