import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  createCustomerReviewOrder,
  getEstimatedDeliveryDate,
} from './customer-review.server'

test('delivery estimate includes dispatch business days and carrier transit', () => {
  assert.equal(
    getEstimatedDeliveryDate(new Date('2026-10-28T10:00:00Z')),
    '2026-11-02',
  )
  assert.equal(
    getEstimatedDeliveryDate(new Date('2026-10-30T10:00:00Z')),
    '2026-11-06',
  )
  assert.equal(
    getEstimatedDeliveryDate(new Date('2026-10-31T10:00:00Z')),
    '2026-11-06',
  )
})

test('delivery estimate uses the Kyiv calendar around midnight and year end', () => {
  assert.equal(
    getEstimatedDeliveryDate(new Date('2026-10-28T22:30:00Z')),
    '2026-11-05',
  )
  assert.equal(
    getEstimatedDeliveryDate(new Date('2026-12-30T22:30:00Z')),
    '2027-01-07',
  )
})

test('review data contains the saved order details without analytics fields', () => {
  assert.deepEqual(
    createCustomerReviewOrder(
      'saved-order',
      'buyer@example.test',
      new Date('2026-10-28T10:00:00Z'),
    ),
    {
      orderId: 'saved-order',
      email: 'buyer@example.test',
      deliveryCountry: 'UA',
      estimatedDeliveryDate: '2026-11-02',
    },
  )
})
