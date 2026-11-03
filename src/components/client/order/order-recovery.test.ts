import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('an unresolved order is reachable with an empty cart and only an explicit retry can submit it', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import * as React from 'react'
    import en from './local/en.json'

    const state = [], refs = []
    let cursor = 0, refCursor = 0, calls = 0
    mock.module('react', () => ({
      ...React,
      useState(value) {
        const i = cursor++
        if (!(i in state)) state[i] = value
        return [state[i], next => { state[i] = next }]
      },
      useRef: value => refs[refCursor++] ??= { current: value },
      useEffect: run => run(),
      useId: () => 'cart',
    }))
    mock.module('next-intl', () => ({
      useLocale: () => 'en', useTranslations: (ns) => (key, values) => {
        let str = en[ns][key]
        for (const [name, value] of Object.entries(values ?? {})) str = str.replace('{' + name + '}', String(value))
        return str
      },
    }))
    mock.module('@/components/client/order/order-form', () => ({ default: 'order-form', ORDER_FORM_ID: 'test-form' }))
    mock.module('@/components/client/order/order-list', () => ({ default: 'order-list' }))
    mock.module('@/components/client/order/order-confirmation', () => ({ default: 'confirmation' }))
    mock.module('@/components/client/cart-product-card', () => ({ default: 'cart-card' }))
    mock.module('@/components/ui/button', () => ({ Button: 'button' }))
    mock.module('@/components/ui/popover', () => ({ Popover: 'popover', PopoverContent: 'popover-content' }))
    mock.module('@/components/client/responsive-motion', () => ({ ResponsiveMotion: 'motion' }))
    mock.module('@/components/ui/loading', () => ({ default: 'loading' }))
    mock.module('@/components/client/transition-link', () => ({ TransitionLink: 'link' }))
    mock.module('@/hooks/useCartProductNames', () => ({ useCartProductNames() {} }))
    mock.module('@/hooks/useToast', () => ({ useToast: () => ({ toast() {} }) }))
    mock.module('@/utils/analytics', () => ({ getCartAnalyticsItems: () => [], trackEcommerceEvent: () => 'queued' }))

    const input = {
      idempotencyKey: 'original-key', products: [{ id: 'sku', weight: 150, count: 3 }], comment: 'Original comment',
    }
    const gate = Promise.withResolvers()
    const store = {
      checkout: { input }, cart: { itemList: [], userData: {} }, totalPrice: 0, minOrderAmount: 300,
      openCart: true, totalProducts: 0, setOpenCart() {},
      async submitOrder(referral, cb) {
        assert.equal(referral, undefined)
        assert.equal(store.checkout.input, input)
        calls++
        const response = await gate.promise
        store.checkout = undefined
        cb(response)
      },
    }
    const useCartStore = Object.assign((select) => select(store), { getState: () => store })
    mock.module('@/store/cart-store', () => ({ useCartStore }))
    const { default: Order } = await import('./src/components/client/order/order.tsx')
    const { default: CartPanel } = await import('./src/components/client/header/cart-panel.tsx')
    const render = () => { cursor = 0; refCursor = 0; return Order({ defaultCities: {} }) }
    function find(node, predicate) {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean)
      return predicate(node) ? node : find(node.props?.children, predicate)
    }
    const cartLink = () => find(CartPanel({ id: 'cart', triggerRef: {current: null} }), node => node.type === 'link')
    assert.equal(cartLink().props.href, '/en/order')
    assert.equal(cartLink().props.children, en.cart['return-to-original'])
    const view = render()
    assert.match(JSON.stringify(view), /Item 1, 150 g × 3/)
    assert.match(JSON.stringify(view), /Original comment/)
    const retry = find(view, node => node.type === 'button')
    assert.equal(retry.props.children, en.order['retry-original'])
    assert.equal(calls, 0, 'mount never replays a saved checkout')
    store.checkout = undefined
    await retry.props.onClick()
    assert.equal(calls, 0, 'a stale retry control cannot submit a new draft')
    store.checkout = { input }
    const pending = retry.props.onClick()
    assert.equal(calls, 1, 'retry bypasses empty cart, minimum and missing form fields')
    const busy = render()
    assert.equal(busy.props['aria-busy'], true)
    assert.equal(find(busy, node => node.type === 'button'), undefined)
    assert.ok(!JSON.stringify(busy).includes(en.order['original-explanation']))
    store.cart.itemList = [{ id: 'edited', name: 'Edited cart', quantity: 1, weight: 15 }]
    store.totalPrice = 10
    assert.equal(cartLink().props.children, en.cart['return-to-original'], 'below-minimum edits keep recovery reachable')
    const receipt = { transactionId: 'accepted-original', items: [], value: 457, currency: 'UAH' }
    gate.resolve({ success: true, receipt, message: {} })
    await pending
    const confirmation = render()
    assert.equal(confirmation.type, 'confirmation')
    assert.equal(confirmation.props.response.receipt, receipt)
    assert.equal(confirmation.props.showOriginalNotice, true)
    confirmation.props.onReturnToDraft()
    assert.ok(find(render(), node => node.type === 'order-form'))
    assert.equal(calls, 1, 'returning to the edited cart never submits it')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
