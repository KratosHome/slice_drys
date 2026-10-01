import assert from 'node:assert/strict'
import { afterAll, beforeEach, describe, mock, test } from 'bun:test'

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
const originalLocalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  'localStorage',
)
const originalMeasurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

const storage = new Map()
const storageApi = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
}
let orderResponse
let submittedOrders

// No database write, payment or notification occurs in these tests.
mock.module('@/server/orders/create-order.server', () => ({
  createOrderServer: async () => {
    submittedOrders += 1
    if (orderResponse instanceof Error) throw orderResponse
    return orderResponse
  },
}))
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: storageApi,
})
const { useCartStore } = await import('./cart-store')

afterAll(() => {
  for (const [key, descriptor] of [
    ['window', originalWindow],
    ['localStorage', originalLocalStorage],
  ]) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor)
    else Reflect.deleteProperty(globalThis, key)
  }
  if (originalMeasurementId === undefined)
    delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  else process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = originalMeasurementId
})

const cartItem = (weight, price, quantity = 1, maxQuantity = 5) => ({
  id: 'beef',
  name: 'Яловичина',
  image: '/beef.webp',
  weight,
  price,
  quantity,
  maxQuantity,
})
const events = () => window.dataLayer.filter((entry) => entry[0] === 'event')

describe('cart changes and order tracking', () => {
  beforeEach(() => {
    storage.clear()
    submittedOrders = 0
    orderResponse = { success: false, message: { uk: 'Помилка' } }
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        dataLayer: [],
        localStorage: storageApi,
        sessionStorage: storageApi,
      },
    })
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'G-TEST123'
    useCartStore.setState({
      openCart: false,
      totalPrice: 0,
      totalProducts: 0,
      cart: { itemList: [], userData: {} },
    })
  })

  test('adding beef 150 g updates only that weight and reports actual additions', () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(30, 100))
    actions.addItemToCart(cartItem(150, 457))
    actions.addItemToCart(cartItem(150, 457, 8, 3))
    assert.deepEqual(
      useCartStore
        .getState()
        .cart.itemList.map(({ weight, quantity }) => ({ weight, quantity })),
      [
        { weight: 30, quantity: 1 },
        { weight: 150, quantity: 3 },
      ],
    )
    assert.equal(useCartStore.getState().totalPrice, 1471)
    assert.equal(events()[2][2].items[0].quantity, 2)
    assert.equal(events()[2][2].value, 914)
    actions.addItemToCart(cartItem(150, 457, 1, 3))
    assert.equal(events().length, 3)
  })

  test('quantity changes track deltas, and reaching stock creates no extra add event', () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457, 2, 3))
    actions.updateItemQuantity('beef', 10, 3, 150)
    actions.updateItemQuantity('beef', 10, 3, 150)
    actions.updateItemQuantity('beef', 1, 3, 150)
    assert.equal(events().length, 3)
    assert.equal(events()[1][2].items[0].quantity, 1)
    assert.equal(events()[2][1], 'remove_from_cart')
    assert.equal(events()[2][2].items[0].quantity, 2)
  })

  test('a cart view is sent on opening and removal identifies the selected weight', () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(30, 100))
    actions.addItemToCart(cartItem(150, 457, 2))
    actions.setOpenCart(true)
    actions.setOpenCart(true)
    actions.removeItemFromCart('beef', 150)
    assert.equal(events().filter((entry) => entry[1] === 'view_cart').length, 1)
    assert.equal(events().at(-1)[2].value, 914)
    assert.deepEqual(
      useCartStore.getState().cart.itemList.map(({ weight }) => weight),
      [30],
    )
  })

  test('a failed order preserves the cart and does not create a purchase event', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457))
    let response
    await actions.submitOrder(undefined, (result) => {
      response = result
    })
    assert.equal(response.success, false)
    assert.equal(useCartStore.getState().cart.itemList.length, 1)
    assert.equal(events().filter((entry) => entry[1] === 'purchase').length, 0)
  })

  test('a confirmed order uses server prices before the cart is cleared', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 415))
    orderResponse = {
      success: true,
      message: { uk: 'Готово' },
      receipt: {
        transactionId: 'server-saved-order-2',
        currency: 'UAH',
        value: 457,
        items: [
          {
            id: 'beef',
            name: 'Яловичина',
            weight: 150,
            price: 457,
            quantity: 1,
          },
        ],
      },
    }
    await Promise.all([
      actions.submitOrder(undefined, () => {}),
      actions.submitOrder(undefined, () => {}),
    ])
    assert.equal(submittedOrders, 1)
    assert.equal(useCartStore.getState().cart.itemList.length, 0)
    const purchases = events().filter((entry) => entry[1] === 'purchase')
    assert.equal(purchases.length, 1)
    assert.equal(purchases[0][2].value, 457)
    assert.equal(purchases[0][2].items[0].price, 457)
    assert.equal(
      events().filter((entry) => entry[1] === 'remove_from_cart').length,
      0,
    )
  })

  test('a failed request preserves the cart and allows retry without a purchase', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457))
    orderResponse = new Error('Connection interrupted')
    let response
    await actions.submitOrder(undefined, (result) => {
      response = result
    })
    assert.equal(response.success, false)
    await actions.submitOrder(undefined, () => {})
    assert.equal(submittedOrders, 2)
    assert.equal(useCartStore.getState().cart.itemList.length, 1)
    assert.equal(events().filter((entry) => entry[1] === 'purchase').length, 0)
  })
})
