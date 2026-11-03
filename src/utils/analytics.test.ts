import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test } from 'node:test'

import {
  getCartAnalyticsItems,
  getProductAnalyticsItem,
  trackCheckoutError,
  trackContactClick,
  trackEcommerceEvent,
  trackLead,
  trackNewsletterSignup,
  trackProductSelection,
  type AnalyticsItem,
} from './analytics'

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
const originalMeasurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
let dataLayer: unknown[][]

const item: AnalyticsItem = {
  item_id: 'beef',
  item_name: 'Яловичина',
  item_variant: '150 g',
  price: 457,
  quantity: 1,
}

describe('GA4 ecommerce', () => {
  beforeEach(() => {
    dataLayer = []
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        dataLayer,
      },
    })
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'G-TEST123'
  })

  afterEach(() => {
    if (originalWindow)
      Object.defineProperty(globalThis, 'window', originalWindow)
    else Reflect.deleteProperty(globalThis, 'window')
    if (originalMeasurementId === undefined) {
      delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
    } else {
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = originalMeasurementId
    }
  })

  test('reports only queued when the Google script is absent and uses UAH totals', () => {
    assert.equal(trackEcommerceEvent('view_item', [item]), 'queued')
    assert.equal(
      trackEcommerceEvent('add_to_cart', [{ ...item, quantity: 2 }]),
      'queued',
    )
    assert.equal(dataLayer[0][0], 'js')
    assert.equal(Array.isArray(dataLayer[2]), false)
    assert.deepEqual(Array.from(dataLayer[1]), ['config', 'G-TEST123'])
    assert.equal(dataLayer.filter((entry) => entry[0] === 'config').length, 1)
    assert.deepEqual(Array.from(dataLayer[3]), [
      'event',
      'add_to_cart',
      {
        send_to: 'G-TEST123',
        currency: 'UAH',
        value: 914,
        items: [{ ...item, quantity: 2 }],
      },
    ])
  })

  test('uses the selected variant price, including the effective sale price', () => {
    const product = {
      _id: 'beef',
      name: 'Яловичина',
      category: 'meat',
    } as IProduct
    const variant = {
      weight: 150,
      price: 415,
      newPrice: 457,
    } as IVariableProduct
    assert.equal(getProductAnalyticsItem(product, variant)?.price, 457)
    assert.equal(
      getProductAnalyticsItem(product, { ...variant, newPrice: 400 })?.discount,
      15,
    )
    assert.equal(
      getProductAnalyticsItem(product, { ...variant, newPrice: 0 })?.price,
      415,
    )
  })

  test('does not queue events when the measurement ID is missing or invalid', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
    assert.equal(trackEcommerceEvent('view_item', [item]), 'skipped')
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'UA-123'
    assert.equal(trackEcommerceEvent('view_item', [item]), 'skipped')
    assert.equal(dataLayer.length, 0)
  })

  test('development never queues events even with a production measurement ID', () => {
    const originalNodeEnv = process.env.NODE_ENV
    try {
      Object.assign(process.env, { NODE_ENV: 'development' })
      assert.equal(trackEcommerceEvent('view_item', [item]), 'skipped')
      assert.equal(dataLayer.length, 0)
    } finally {
      Object.assign(process.env, { NODE_ENV: originalNodeEnv })
    }
  })

  test('selection preserves the displayed list and variant context', () => {
    const product = {
      _id: 'beef',
      name: 'Яловичина',
      category: 'meat',
    } as IProduct
    const variant = { weight: 150, price: 457 } as IVariableProduct
    trackProductSelection(product, variant, {
      id: 'products/meat/beef',
      name: 'Яловичина',
      index: 2,
    })
    const parameters = dataLayer[2][2] as {
      item_list_id: string
      item_list_name: string
      items: AnalyticsItem[]
    }
    assert.equal(parameters.item_list_id, 'products/meat/beef')
    assert.equal(parameters.item_list_name, 'Яловичина')
    assert.equal(parameters.items[0].index, 2)
    assert.equal(parameters.items[0].item_variant, '150 g')
  })

  test('queues only fixed labels for leads, contacts, errors and subscriptions', () => {
    assert.equal(trackLead('wholesale'), 'queued')
    assert.equal(trackLead('callback'), 'queued')
    assert.equal(trackContactClick('email'), 'queued')
    assert.equal(trackContactClick('phone'), 'queued')
    assert.equal(trackCheckoutError('order_unconfirmed'), 'queued')
    assert.equal(trackNewsletterSignup(), 'queued')
    assert.deepEqual(
      dataLayer.slice(2).map((entry) => Array.from(entry)),
      [
        [
          'event',
          'generate_lead',
          { send_to: 'G-TEST123', form_type: 'wholesale' },
        ],
        [
          'event',
          'generate_lead',
          { send_to: 'G-TEST123', form_type: 'callback' },
        ],
        [
          'event',
          'contact_click',
          { send_to: 'G-TEST123', contact_method: 'email' },
        ],
        [
          'event',
          'contact_click',
          { send_to: 'G-TEST123', contact_method: 'phone' },
        ],
        [
          'event',
          'checkout_error',
          { send_to: 'G-TEST123', error_code: 'order_unconfirmed' },
        ],
        ['event', 'newsletter_signup', { send_to: 'G-TEST123' }],
      ],
    )
  })

  test('rejects user data supplied in place of technical labels at runtime', () => {
    // @ts-expect-error Reject unchecked input from callers outside TypeScript.
    assert.equal(trackCheckoutError('buyer@example.test'), 'skipped')
    // @ts-expect-error Contact destinations are not analytics parameters.
    assert.equal(trackContactClick('tel:+380000000000'), 'skipped')
    // @ts-expect-error Only the two known form types are allowed.
    assert.equal(trackLead('private address'), 'skipped')
    assert.equal(dataLayer.length, 0)
  })

  test('ignores invalid quantities and treats an empty cart as a cart view', () => {
    assert.equal(
      trackEcommerceEvent('add_to_cart', [{ ...item, quantity: 0 }]),
      'skipped',
    )
    assert.equal(trackEcommerceEvent('view_cart', []), 'queued')
    assert.equal(dataLayer[2][1], 'view_cart')
  })

  test('cart mapping excludes any checkout contact fields', () => {
    const cartItem = {
      id: 'beef',
      name: 'Яловичина',
      weight: 150,
      price: 457,
      quantity: 1,
      maxQuantity: 5,
      image: '/product.webp',
      email: 'private@example.test',
    }
    assert.deepEqual(getCartAnalyticsItems([cartItem]), [item])
  })

  test('an analytics failure never propagates to checkout', () => {
    Object.defineProperty(window, 'gtag', {
      value: () => {
        throw new Error('Analytics blocked')
      },
    })
    assert.equal(trackEcommerceEvent('add_to_cart', [item]), 'skipped')
  })
})
