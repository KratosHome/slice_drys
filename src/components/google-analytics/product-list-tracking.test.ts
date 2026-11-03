import assert from 'node:assert/strict'
import { test } from 'node:test'

import { observeProductListItem } from './product-list-tracking'
import {
  getProductAnalyticsItem,
  trackProductSelection,
  type AnalyticsItem,
} from '@/utils/analytics'

test('list impressions follow visible cards, variants and list positions', () => {
  const originalGlobals = new Map(
    ['window', 'document', 'IntersectionObserver'].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  )
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  const dataLayer: unknown[][] = []
  const doc = Object.assign(new EventTarget(), { hidden: false })
  const observers: StubObserver[] = []
  class StubObserver {
    card?: Element
    constructor(
      private notify: IntersectionObserverCallback,
      readonly options: IntersectionObserverInit,
    ) {
      observers.push(this)
    }
    observe(card: Element) {
      this.card = card
    }
    disconnect() {
      this.card = undefined
    }
    report(ratio: number) {
      this.notify(
        [
          {
            isIntersecting: ratio > 0,
            intersectionRatio: ratio,
          } as IntersectionObserverEntry,
        ],
        this as unknown as IntersectionObserver,
      )
    }
  }
  const product = { _id: 'beef', name: 'Beef', category: 'meat' }
  const variant = { weight: 150, price: 457 } as IVariableProduct
  const item = getProductAnalyticsItem(product, variant)!
  const list = {
    id: 'recommended_products',
    name: 'You might also like',
    index: 2,
  }
  const card = {} as Element
  const seen = new Set<string>()
  const events = (name: string) =>
    dataLayer
      .filter((entry) => entry[0] === 'event' && entry[1] === name)
      .map(
        (entry) =>
          entry[2] as {
            item_list_id: string
            item_list_name: string
            items: AnalyticsItem[]
          },
      )
  try {
    for (const [key, value] of Object.entries({
      window: { dataLayer },
      document: doc,
      IntersectionObserver: StubObserver,
    })) {
      Object.defineProperty(globalThis, key, { configurable: true, value })
    }
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'G-TEST123'

    const cleanup = observeProductListItem(card, item, list, seen)
    assert.equal(observers[0].card, card)
    assert.equal(observers[0].options.threshold, 0.5)
    observers[0].report(0)
    observers[0].report(0.49)
    assert.deepEqual(events('view_item_list'), [])

    doc.hidden = true
    doc.dispatchEvent(new Event('visibilitychange'))
    observers[0].report(1)
    assert.deepEqual(events('view_item_list'), [])
    doc.hidden = false
    doc.dispatchEvent(new Event('visibilitychange'))
    observers[0].report(1) // A late callback from before resuming.
    assert.deepEqual(events('view_item_list'), [])
    observers[1].report(0.5)
    observers[1].report(1)
    assert.equal(events('view_item_list').length, 1)
    assert.equal(observers[1].card, undefined)
    cleanup?.()

    observeProductListItem(card, item, list, seen)
    assert.equal(
      observers.length,
      2,
      'a rerender does not observe an already seen card',
    )
    trackProductSelection(product, variant, list)
    const impression = events('view_item_list')[0]
    const selection = events('select_item')[0]
    assert.equal(impression.item_list_id, 'recommended_products')
    assert.equal(impression.item_list_name, list.name)
    assert.equal(impression.items[0].index, 2)
    assert.equal(impression.items[0].item_variant, '150 g')
    assert.deepEqual(impression, selection)

    const changed = { ...item, item_variant: '30 g' }
    const stop = observeProductListItem(card, changed, list, seen)
    stop?.()
    observers[2].report(1)
    assert.equal(
      events('view_item_list').length,
      1,
      'detached cards ignore stale callbacks',
    )
    observeProductListItem(card, changed, list, seen)
    observers[3].report(1)
    assert.equal(events('view_item_list')[1].items[0].item_variant, '30 g')

    observeProductListItem(
      card,
      item,
      { id: 'popular_products', name: 'Popular', index: 0 },
      new Set(),
    )
    observers[4].report(1)
    assert.equal(events('view_item_list')[2].item_list_id, 'popular_products')
    assert.equal(events('view_item_list')[2].items[0].index, 0)
  } finally {
    for (const [key, descriptor] of originalGlobals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else Reflect.deleteProperty(globalThis, key)
    }
    if (measurementId === undefined)
      delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
    else process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = measurementId
  }
})
