import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { buildProductNode, serializeJsonLd } from './json-ld'
import type { ProductReview, ProductReviewsData } from '@/types/product-review'

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
  const review = (id: string, rating: number): ProductReview => ({
    id,
    rating,
    author: 'Олена',
    text: 'Смачно!',
    createdAt: '2026-11-06T12:00:00.000Z',
    isStoreRepresentative: false,
    photos: [],
    replies: [],
  })
  const snapshot = (
    reviews: ProductReview[],
    productId = 'product-id',
  ): ProductReviewsData => ({
    productId,
    reviews,
    ratingCount: reviews.length,
    averageRating: reviews.length
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
      : null,
  })

  test('no approved ratings means no rating or review markup', () => {
    for (const data of [undefined, snapshot([])]) {
      const node = buildProductNode(productWithVariants([]), canonicalUrl, data)
      assert.equal('aggregateRating' in node, false)
      assert.equal('review' in node, false)
    }
  })

  test('one genuine review has its actual score, author, date and visible body', () => {
    const item = review('first', 2)
    const node = buildProductNode(
      productWithVariants([]),
      canonicalUrl,
      snapshot([item]),
    )
    assert.deepEqual(node.aggregateRating, {
      '@type': 'AggregateRating',
      ratingValue: 2,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    })
    assert.deepEqual(node.review, [
      {
        '@type': 'Review',
        '@id': canonicalUrl + '#review-first',
        author: { '@type': 'Person', name: item.author },
        datePublished: item.createdAt,
        reviewBody: item.text,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 2,
          bestRating: 5,
          worstRating: 1,
        },
      },
    ])
  })

  test('weights share the actual product average; replies never count as ratings', () => {
    const first = review('first', 4)
    first.replies.push({
      id: 'reply',
      author: 'SliceDrys',
      text: 'Дякуємо!',
      createdAt: first.createdAt,
      isStoreRepresentative: true,
    })
    const data = snapshot([first, review('second', 5)])
    const product = productWithVariants(
      [30, 150].map((weight) => ({
        weight,
        price: 100,
        currency: 'UAH',
        count: 2,
      })),
    )
    const node = buildProductNode(product, canonicalUrl, data)
    assert.deepEqual(node.aggregateRating, {
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 2,
    })
    assert.equal((node.review as unknown[]).length, 2)
    assert.equal(JSON.stringify(node.review).includes('Дякуємо'), false)
  })

  test('another product cannot contribute ratings; review HTML cannot escape the script', () => {
    const item = {
      ...review('first', 1),
      text: '</script><script>alert(1)</script>',
    }
    const wrongProduct = buildProductNode(
      productWithVariants([]),
      canonicalUrl,
      snapshot([item], 'another-product'),
    )
    assert.equal('aggregateRating' in wrongProduct, false)
    const json = serializeJsonLd(
      buildProductNode(productWithVariants([]), canonicalUrl, snapshot([item])),
    )
    assert.equal(json.includes('</script>'), false)
    assert.equal(JSON.parse(json).review[0].reviewBody, item.text)
  })

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
