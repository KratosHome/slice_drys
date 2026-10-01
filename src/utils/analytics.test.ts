import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test } from 'node:test'

import {
  getCartAnalyticsItems,
  getProductAnalyticsItem,
  trackEcommerceEvent,
  trackProductSelection,
  trackPurchase,
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
    const session = new Map<string, string>()
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        dataLayer,
        sessionStorage: {
          getItem: (key: string) => session.get(key) ?? null,
          setItem: (key: string, value: string) => session.set(key, value),
        },
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

  test('queues initialization before early product events and uses UAH totals', () => {
    assert.equal(trackEcommerceEvent('view_item', [item]), true)
    assert.equal(
      trackEcommerceEvent('add_to_cart', [{ ...item, quantity: 2 }]),
      true,
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
    assert.equal(trackEcommerceEvent('view_item', [item]), false)
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'UA-123'
    assert.equal(trackEcommerceEvent('view_item', [item]), false)
    assert.equal(dataLayer.length, 0)
  })

  test('development never queues events even with a production measurement ID', () => {
    const originalNodeEnv = process.env.NODE_ENV
    try {
      Object.assign(process.env, { NODE_ENV: 'development' })
      assert.equal(trackEcommerceEvent('view_item', [item]), false)
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

  test('ignores invalid quantities and treats an empty cart as a cart view', () => {
    assert.equal(
      trackEcommerceEvent('add_to_cart', [{ ...item, quantity: 0 }]),
      false,
    )
    assert.equal(trackEcommerceEvent('view_cart', []), true)
    assert.equal(dataLayer[2][1], 'view_cart')
  })

  test('sends only receipt products and a saved transaction ID once', () => {
    const receipt: IOrderReceipt = {
      transactionId: 'saved-order-1',
      currency: 'UAH',
      value: 914,
      items: [
        { id: 'beef', name: 'Яловичина', weight: 150, price: 457, quantity: 2 },
      ],
    }
    assert.equal(trackPurchase(receipt), true)
    assert.equal(trackPurchase(receipt), false)
    const purchases = dataLayer.filter((entry) => entry[1] === 'purchase')
    assert.equal(purchases.length, 1)
    assert.deepEqual(purchases[0][2], {
      send_to: 'G-TEST123',
      currency: 'UAH',
      transaction_id: 'saved-order-1',
      value: 914,
      items: [{ ...item, quantity: 2 }],
    })
  })

  test('rejects a purchase without an ID or with an inconsistent total', () => {
    const receipt: IOrderReceipt = {
      transactionId: '',
      currency: 'UAH',
      value: 457,
      items: [
        { id: 'beef', name: 'Яловичина', weight: 150, price: 457, quantity: 1 },
      ],
    }
    assert.equal(trackPurchase(receipt), false)
    assert.equal(
      trackPurchase({ ...receipt, transactionId: 'invalid-total', value: 415 }),
      false,
    )
    assert.equal(dataLayer.length, 0)
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
    assert.equal(trackEcommerceEvent('add_to_cart', [item]), false)
  })
})
