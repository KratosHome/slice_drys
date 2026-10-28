import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'

import type { CustomerReviewOrder } from '@/types/google-customer-reviews'
import {
  getCustomerReviewPayload,
  renderCustomerReviewOptIn,
} from './google-customer-reviews'

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
let moduleCallbacks: Array<() => void>
let rendered: unknown[]

const order: CustomerReviewOrder = {
  orderId: 'saved-order',
  email: 'buyer@example.test',
  deliveryCountry: 'UA',
  estimatedDeliveryDate: '2026-11-02',
}

beforeEach(() => {
  moduleCallbacks = []
  rendered = []
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      gapi: {
        load: (module: string, callback: () => void) => {
          assert.equal(module, 'surveyoptin')
          moduleCallbacks.push(callback)
        },
        surveyoptin: { render: (payload: unknown) => rendered.push(payload) },
      },
    },
  })
})

afterEach(() => {
  if (originalWindow)
    Object.defineProperty(globalThis, 'window', originalWindow)
  else Reflect.deleteProperty(globalThis, 'window')
})

test('sends the saved order fields to the configured merchant without other contact data', () => {
  assert.deepEqual(getCustomerReviewPayload(order), {
    merchant_id: 5571397067,
    order_id: 'saved-order',
    email: 'buyer@example.test',
    delivery_country: 'UA',
    estimated_delivery_date: '2026-11-02',
  })
})

test('invalid emails, order IDs, countries and delivery dates never reach Google', () => {
  for (const invalidOrder of [
    { ...order, orderId: ' ' },
    { ...order, email: 'invalid' },
    { ...order, deliveryCountry: 'ZZ' } as unknown as CustomerReviewOrder,
    { ...order, estimatedDeliveryDate: '2026-02-30' },
    { ...order, estimatedDeliveryDate: '2026-13-01' },
    { ...order, estimatedDeliveryDate: '2026-1-1' },
  ]) {
    assert.equal(getCustomerReviewPayload(invalidOrder), undefined)
    renderCustomerReviewOptIn(invalidOrder, () => true)
  }
  assert.equal(moduleCallbacks.length, 0)
  assert.equal(rendered.length, 0)
})

test('queued module callbacks and repeated mounts display one invitation per saved order', () => {
  const savedOrder = { ...order, orderId: 'deduplicated-order' }
  renderCustomerReviewOptIn(savedOrder, () => true)
  renderCustomerReviewOptIn(savedOrder, () => true)
  for (const callback of moduleCallbacks) callback()
  renderCustomerReviewOptIn(savedOrder, () => true)
  assert.equal(rendered.length, 1)

  renderCustomerReviewOptIn({ ...order, orderId: 'another-order' }, () => true)
  moduleCallbacks.at(-1)!()
  assert.equal(rendered.length, 2)
})

test('a delayed Google callback cannot open an invitation after leaving confirmation', () => {
  let active = true
  const savedOrder = { ...order, orderId: 'unmounted-order' }
  renderCustomerReviewOptIn(savedOrder, () => active)
  active = false
  moduleCallbacks[0]()
  assert.equal(rendered.length, 0)

  // A fresh mount remains eligible when an earlier StrictMode effect was cleaned up.
  renderCustomerReviewOptIn(savedOrder, () => true)
  moduleCallbacks[1]()
  assert.equal(rendered.length, 1)
})

test('unavailable or throwing Google scripts cannot fail the confirmation flow', () => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {},
  })
  assert.doesNotThrow(() => renderCustomerReviewOptIn(order, () => true))
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { gapi: { load: () => { throw new Error('blocked') } } },
  })
  assert.doesNotThrow(() => renderCustomerReviewOptIn(order, () => true))
})

test('a failed render can be retried without breaking the saved order screen', () => {
  let attempts = 0
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      gapi: {
        load: (_module: string, callback: () => void) => callback(),
        surveyoptin: {
          render: () => {
            attempts += 1
            if (attempts === 1) throw new Error('temporarily unavailable')
          },
        },
      },
    },
  })
  const savedOrder = { ...order, orderId: 'retry-order' }
  assert.doesNotThrow(() => renderCustomerReviewOptIn(savedOrder, () => true))
  assert.doesNotThrow(() => renderCustomerReviewOptIn(savedOrder, () => true))
  assert.equal(attempts, 2)
})
