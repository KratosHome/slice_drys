import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import ReviewModerationCard from './review-moderation-card'
import type { AdminProductReview } from '@/types/product-review'

const review: AdminProductReview = {
  id: 'review-1',
  productId: 'product-1',
  productName: 'Яловичина',
  productSlug: 'beef',
  author: 'Олена',
  text: 'Смачні джерки <script>alert(1)</script>',
  createdAt: '2026-11-06T10:00:00.000Z',
  isStoreRepresentative: false,
  parentId: null,
  parentText: null,
  rating: 4,
  photos: [],
  status: 'pending',
}

const render = (changes: Partial<AdminProductReview> = {}) =>
  renderToStaticMarkup(
    <ReviewModerationCard
      item={{ ...review, ...changes }}
      disabled={false}
      onAction={async () => true}
    />,
  )

test('moderation displays user content safely with product, author, status and actual rating', () => {
  const html = render()
  for (const text of [
    'Яловичина',
    'Олена',
    'Очікує перевірки',
    'Оцінка: 4 з 5',
  ]) {
    assert.ok(html.includes(text))
  }
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('dateTime="2026-11-06T10:00:00.000Z"'))
})

test('store replies are offered only on approved roots, never on replies', () => {
  assert.ok(!render().includes('Відповісти від магазину'))
  assert.ok(render({ status: 'approved' }).includes('Відповісти від магазину'))
  const reply = render({
    parentId: 'parent-1',
    parentText: 'Основний текст покупця',
    rating: null,
    status: 'approved',
    isStoreRepresentative: true,
  })
  assert.ok(!reply.includes('Відповісти від магазину'))
  assert.ok(!reply.includes('Оцінка:'))
  assert.ok(reply.includes('Основний текст покупця'))
  assert.ok(reply.includes('Представник магазину'))
})

test('moderation offers preview controls for every submitted photo', () => {
  const html = render({
    photos: [
      {
        publicId: 'first',
        url: '/api/product-review-photos/review-1/0',
      },
      {
        publicId: 'second',
        url: '/api/product-review-photos/review-1/1',
      },
    ],
  })
  assert.ok(html.includes('Збільшити фото 1 відгуку Олена'))
  assert.ok(html.includes('Збільшити фото 2 відгуку Олена'))
  assert.equal((html.match(/<img /g) ?? []).length, 2)
  assert.ok(html.includes('src="/api/product-review-photos/review-1/0"'))
  assert.ok(!html.includes('/_next/image'))
})
