import assert from 'node:assert/strict'
import { isDeepStrictEqual } from 'node:util'
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
  createOrderServer: async (input) => {
    submittedOrders.push(input)
    if (typeof orderResponse === 'function') return orderResponse(input)
    if (orderResponse instanceof Error) throw orderResponse
    return orderResponse
  },
}))
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: storageApi,
})
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { localStorage: storageApi },
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
const checkoutErrors = () =>
  events().filter((entry) => entry[1] === 'checkout_error')

const confirmation = {
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

const checkoutProductId = '507f1f77bcf86cd799439011'

function fillCheckout(actions, comment) {
  actions.addItemToCart({ ...cartItem(150, 457), id: checkoutProductId })
  actions.setCartUserData({
    name: 'Test',
    surname: 'Buyer',
    phoneNumber: '+380631234567',
    email: 'buyer@example.test',
    deliveryInfo: {
      city: { label: 'Test city' },
      branch: { label: 'Test branch' },
    },
    comment,
  })
}

function acceptAndLoseFirstAcknowledgement(errorCode = 'transport_error') {
  // Model the order boundary: a fresh key saves a fresh order; a reused
  // key can recover its receipt only if the submitted payload matches.
  const saved = new Map()
  orderResponse = (input) => {
    const prior = saved.get(input.idempotencyKey)
    if (prior) {
      return isDeepStrictEqual(prior.input, input)
        ? prior.response
        : {
            success: false,
            errorCode: 'idempotency_conflict',
            message: {},
          }
    }
    const items = input.products.map(({ id, weight, count }) => ({
      ...confirmation.receipt.items[0],
      id,
      weight,
      quantity: count,
    }))
    const response = {
      ...confirmation,
      receipt: {
        currency: 'UAH',
        transactionId: `saved-${saved.size + 1}`,
        items,
        value: items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      },
    }
    saved.set(input.idempotencyKey, {
      input: structuredClone(input),
      response,
    })
    if (saved.size === 1) {
      if (errorCode === 'transport_error')
        throw new Error('Connection lost after commit')
      return { success: false, errorCode, message: {} }
    }
    return response
  }
  return saved
}

async function reloadCart(persisted = storageApi.getItem('slice-drys-cart')) {
  useCartStore.setState({ checkout: undefined, cart: { itemList: [] } })
  storageApi.setItem('slice-drys-cart', persisted)
  await useCartStore.persist.rehydrate()
}

describe('cart changes and order tracking', () => {
  beforeEach(() => {
    storage.clear()
    submittedOrders = []
    orderResponse = {
      success: false,
      errorCode: 'product_unavailable',
      message: { uk: 'Помилка' },
    }
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
      checkout: undefined,
      openCart: false,
      totalPrice: 0,
      totalProducts: 0,
      cart: { itemList: [], userData: {} },
    })
  })

  test('adding to cart can allocate a v4 key without the secure-context randomUUID API', () => {
    const own = Object.getOwnPropertyDescriptor(crypto, 'randomUUID')
    Object.defineProperty(crypto, 'randomUUID', {
      value: undefined,
      configurable: true,
    })
    try {
      useCartStore.getState().addItemToCart(cartItem(150, 457))
      assert.match(
        useCartStore.getState().checkout.key,
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      )
    } finally {
      if (own) Object.defineProperty(crypto, 'randomUUID', own)
      else Reflect.deleteProperty(crypto, 'randomUUID')
    }
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

  test('legacy persisted rows gain both names without changing the cart or customer data', async () => {
    const legacyItems = [cartItem(30, 100), cartItem(150, 457, 2)]
    const userData = {
      name: 'Test',
      deliveryInfo: { deliveryMethod: 'branch' },
    }
    storageApi.setItem(
      'slice-drys-cart',
      JSON.stringify({
        version: 0,
        state: {
          cart: { itemList: legacyItems, userData },
          totalProducts: 3,
          totalPrice: 1014,
        },
      }),
    )
    await useCartStore.persist.rehydrate()
    const checkoutKey = useCartStore.getState().checkout.key
    assert.equal(
      JSON.parse(storageApi.getItem('slice-drys-cart')).state.checkout.key,
      checkoutKey,
    )
    await useCartStore.persist.rehydrate()
    assert.equal(useCartStore.getState().checkout.key, checkoutKey)
    const names = { uk: 'Яловичина', en: 'Beef' }
    useCartStore.getState().setItemNames([{ id: 'beef', names }])

    const state = useCartStore.getState()
    assert.deepEqual(
      state.cart.itemList,
      legacyItems.map((item) => ({ ...item, names })),
    )
    assert.deepEqual(state.cart.userData, userData)
    assert.equal(state.totalPrice, 1014)
    assert.equal(state.totalProducts, 3)
    assert.equal(events().length, 0)
    assert.deepEqual(
      JSON.parse(storageApi.getItem('slice-drys-cart')).state.cart.itemList[0]
        .names,
      names,
    )
  })

  test('late name lookup preserves current quantities and never restores removed rows', () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(30, 100))
    actions.addItemToCart(cartItem(150, 457))
    actions.updateItemQuantity('beef', 3, 5, 150)
    actions.removeItemFromCart('beef', 30)
    const tracked = events().length
    const names = { uk: 'Яловичина', en: 'Beef' }
    actions.setItemNames([
      { id: 'beef', names },
      { id: 'removed-product', names: { uk: 'Видалений', en: 'Removed' } },
    ])

    assert.deepEqual(useCartStore.getState().cart.itemList, [
      { ...cartItem(150, 457, 3), names },
    ])
    assert.equal(useCartStore.getState().totalPrice, 1371)
    assert.equal(events().length, tracked)
    actions.addItemToCart(cartItem(150, 457))
    assert.deepEqual(useCartStore.getState().cart.itemList[0].names, names)
  })

  test('missing or partial name results keep the saved fallback and existing translations', () => {
    const actions = useCartStore.getState()
    actions.addItemToCart({ ...cartItem(30, 100), names: { en: 'Beef' } })
    const cart = useCartStore.getState().cart
    actions.setItemNames([])
    assert.equal(useCartStore.getState().cart, cart)
    actions.setItemNames([{ id: 'beef', names: { uk: ' Яловичина ', en: '' } }])
    assert.equal(useCartStore.getState().cart.itemList[0].name, 'Яловичина')
    assert.deepEqual(useCartStore.getState().cart.itemList[0].names, {
      uk: 'Яловичина',
      en: 'Beef',
    })
  })

  test('a rejected attempt preserves the cart and reports only its error code once across concurrent callers', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457))
    actions.setCartUserData({
      email: 'private@example.test',
      comment: 'private instructions',
    })
    orderResponse.message.uk = 'private error details'
    let response
    await Promise.all([
      actions.submitOrder(undefined, (result) => {
        response = result
      }),
      actions.submitOrder(undefined, () => {}),
    ])
    assert.equal(response.success, false)
    assert.equal(response.errorCode, 'product_unavailable')
    assert.equal(useCartStore.getState().cart.itemList.length, 1)
    assert.equal(submittedOrders.length, 1)
    assert.deepEqual(
      checkoutErrors().map((entry) => entry[2]),
      [{ send_to: 'G-TEST123', error_code: 'product_unavailable' }],
    )
    assert.equal(events().filter((entry) => entry[1] === 'purchase').length, 0)
  })

  test('empty and locally unavailable checkouts report their cause and allow corrected input on recovery', async () => {
    const actions = useCartStore.getState()
    const responses = []
    await actions.submitOrder(undefined, (result) => responses.push(result))
    fillCheckout(actions, 'Prepared but never sent')
    const setItem = storageApi.setItem
    storageApi.setItem = () => {
      throw new Error('private storage details')
    }
    try {
      await actions.submitOrder(undefined, (result) => responses.push(result))
    } finally {
      storageApi.setItem = setItem
    }
    assert.deepEqual(
      responses.map((result) => result.errorCode),
      ['cart_empty', 'checkout_unavailable'],
    )
    assert.deepEqual(
      checkoutErrors().map((entry) => entry[2].error_code),
      ['cart_empty', 'checkout_unavailable'],
    )
    assert.equal(submittedOrders.length, 0)
    assert.equal(useCartStore.getState().checkout?.input, undefined)
    actions.setCartUserData({
      ...useCartStore.getState().cart.userData,
      comment: 'Corrected after storage recovered',
    })
    orderResponse = confirmation
    await actions.submitOrder('new-referral', (result) =>
      responses.push(result),
    )
    assert.equal(submittedOrders.length, 1)
    assert.equal(
      submittedOrders[0].comment,
      'Corrected after storage recovered',
    )
    assert.equal(submittedOrders[0].referralCode, 'new-referral')
    assert.deepEqual(responses[2], confirmation)
  })

  test('duplicate submits share the receipt and never emit a browser purchase', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 415))
    orderResponse = confirmation
    const responses = []
    await Promise.all([
      actions.submitOrder(undefined, (result) => responses.push(result)),
      actions.submitOrder(undefined, (result) => responses.push(result)),
    ])
    assert.equal(submittedOrders.length, 1)
    assert.deepEqual(responses, [confirmation, confirmation])
    assert.equal(useCartStore.getState().cart.itemList.length, 0)
    assert.equal(events().filter((entry) => entry[1] === 'purchase').length, 0)
    assert.equal(
      storage.has('ga4-purchase:' + confirmation.receipt.transactionId),
      false,
    )
    assert.equal(
      events().filter((entry) => entry[1] === 'remove_from_cart').length,
      0,
    )
    actions.addItemToCart(cartItem(150, 415))
    await actions.submitOrder(undefined, () => {})
    assert.notEqual(
      submittedOrders[1].idempotencyKey,
      submittedOrders[0].idempotencyKey,
    )
  })

  for (const edit of [
    'comment',
    'quantity',
    'clear cart',
    'remove last item',
  ]) {
    for (const reload of [false, true]) {
      test(`an accepted order survives a lost response and a ${edit} edit${reload ? ' across reload' : ''}`, async () => {
        const actions = useCartStore.getState()
        fillCheckout(actions, 'Original comment')
        const saved = acceptAndLoseFirstAcknowledgement()
        const responses = []
        const receive = (result) => responses.push(result)
        await actions.submitOrder('original-referral', receive)
        assert.equal(responses[0].errorCode, 'transport_error')
        assert.match(submittedOrders[0].idempotencyKey, /^[0-9a-f-]{36}$/)
        const original = saved.get(submittedOrders[0].idempotencyKey)
        assert.equal(original.input.comment, 'Original comment')
        assert.equal(original.input.products[0].count, 1)
        if (edit === 'comment') {
          actions.setCartUserData({
            ...useCartStore.getState().cart.userData,
            comment: 'Edited comment',
          })
          assert.equal(
            useCartStore.getState().cart.userData.comment,
            'Edited comment',
          )
        } else if (edit === 'quantity') {
          actions.updateItemQuantity(checkoutProductId, 2, 5, 150)
          assert.equal(useCartStore.getState().cart.itemList[0].quantity, 2)
        } else if (edit === 'clear cart') {
          actions.clearCart()
          assert.equal(useCartStore.getState().cart.itemList.length, 0)
        } else {
          actions.removeItemFromCart(checkoutProductId, 150)
          assert.equal(useCartStore.getState().cart.itemList.length, 0)
        }
        const draft = JSON.stringify(useCartStore.getState().cart)
        if (reload) await reloadCart()

        // The referral may also have expired by the time the buyer retries.
        await actions.submitOrder(undefined, receive)
        assert.equal(saved.size, 1, 'the retry must not create a second order')
        assert.deepEqual(submittedOrders, [original.input, original.input])
        assert.deepEqual(
          responses[1],
          original.response,
          'the buyer recovers the receipt for the accepted order',
        )
        assert.equal(
          JSON.stringify(useCartStore.getState().cart),
          draft,
          'reconciliation preserves the edited draft',
        )
        assert.deepEqual(
          checkoutErrors().map((entry) => entry[2].error_code),
          ['transport_error'],
        )
        assert.equal(
          events().filter((entry) => entry[1] === 'purchase').length,
          0,
        )
      })
    }
  }

  test('storage failure before a replay retains the snapshot of the unresolved order', async () => {
    const actions = useCartStore.getState()
    fillCheckout(actions, 'Original order')
    const saved = acceptAndLoseFirstAcknowledgement()
    const responses = []
    const receive = (result) => responses.push(result)
    await actions.submitOrder('original-referral', receive)
    const original = saved.get(submittedOrders[0].idempotencyKey)
    assert.equal(responses[0].errorCode, 'transport_error')
    actions.updateItemQuantity(checkoutProductId, 2, 5, 150)

    const setItem = storageApi.setItem
    storageApi.setItem = () => {
      throw new Error('Quota exceeded')
    }
    try {
      await actions.submitOrder(undefined, receive)
      assert.equal(responses[1].errorCode, 'checkout_unavailable')
      assert.equal(submittedOrders.length, 1)
    } finally {
      storageApi.setItem = setItem
    }
    await actions.submitOrder(undefined, receive)
    assert.equal(saved.size, 1)
    assert.deepEqual(submittedOrders, [original.input, original.input])
    assert.deepEqual(responses[2], original.response)
    assert.equal(useCartStore.getState().cart.itemList[0].quantity, 2)
  })

  test('v1 migration snapshots a previously submitted cart before it can be edited', async () => {
    const actions = useCartStore.getState()
    fillCheckout(actions, 'Submitted before the upgrade')
    const saved = acceptAndLoseFirstAcknowledgement('order_unconfirmed')
    const responses = []
    const receive = (result) => responses.push(result)
    await actions.submitOrder('legacy-referral', receive)
    assert.equal(responses[0].errorCode, 'order_unconfirmed')
    const submitted = submittedOrders[0]
    const previous = JSON.parse(storageApi.getItem('slice-drys-cart'))
    previous.version = 1
    previous.state.checkout = {
      key: submitted.idempotencyKey,
      submitted: true,
      referralCode: 'legacy-referral',
    }
    await reloadCart(JSON.stringify(previous))
    actions.setCartUserData({ comment: 'Edited after the upgrade' })
    await reloadCart()
    await actions.submitOrder(undefined, receive)
    assert.equal(saved.size, 1)
    assert.deepEqual(submittedOrders, [submitted, submitted])
    assert.deepEqual(responses[1], saved.get(submitted.idempotencyKey).response)
    assert.equal(
      useCartStore.getState().cart.userData.comment,
      'Edited after the upgrade',
    )
  })

  test('a definitive rejection allows corrections under the same unused key', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457))
    await actions.submitOrder(undefined, () => {})
    actions.setCartUserData({ comment: 'Changed comment' })
    await actions.submitOrder(undefined, () => {})
    actions.updateItemQuantity('beef', 2, 5, 150)
    await actions.submitOrder(undefined, () => {})
    const keys = submittedOrders.map((order) => order.idempotencyKey)
    assert.equal(new Set(keys).size, 1)
    assert.deepEqual(
      submittedOrders.map((input) => [input.comment, input.products[0].count]),
      [
        ['', 1],
        ['Changed comment', 1],
        ['Changed comment', 2],
      ],
    )
  })

  test('submitting edited details while awaiting acceptance joins the original request', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457))
    const accepted = Promise.withResolvers()
    orderResponse = accepted.promise
    const results = []
    const receive = (result) => results.push(result)
    const firstSubmit = actions.submitOrder(undefined, receive)
    actions.updateItemQuantity('beef', 2, 5, 150)
    const secondSubmit = actions.submitOrder(undefined, receive)
    accepted.resolve(confirmation)
    await Promise.all([firstSubmit, secondSubmit])
    assert.equal(submittedOrders.length, 1)
    assert.equal(submittedOrders[0].products[0].count, 1)
    assert.deepEqual(results, [confirmation, confirmation])
    assert.equal(useCartStore.getState().cart.itemList[0].quantity, 2)
    assert.equal(checkoutErrors().length, 0)

    // A separate checkout after the first confirmation may place the edited draft.
    orderResponse = {
      ...confirmation,
      receipt: {
        ...confirmation.receipt,
        transactionId: 'new-order',
        value: 914,
        items: [{ ...confirmation.receipt.items[0], quantity: 2 }],
      },
    }
    await actions.submitOrder(undefined, receive)
    assert.equal(submittedOrders.length, 2)
    assert.equal(submittedOrders[1].products[0].count, 2)
    assert.notEqual(
      submittedOrders[1].idempotencyKey,
      submittedOrders[0].idempotencyKey,
    )
    assert.equal(results[2].receipt.transactionId, 'new-order')
  })

  test('a storage failure clearing the cart cannot turn acceptance into a checkout failure', async () => {
    const actions = useCartStore.getState()
    actions.addItemToCart(cartItem(150, 457))
    const setItem = storageApi.setItem
    orderResponse = () => {
      storageApi.setItem = () => {
        throw new Error('Quota exceeded')
      }
      return confirmation
    }
    try {
      const responses = []
      await actions.submitOrder(undefined, (result) => responses.push(result))
      assert.deepEqual(responses, [confirmation])
      assert.equal(checkoutErrors().length, 0)
      assert.equal(
        JSON.parse(storageApi.getItem('slice-drys-cart')).state.checkout.key,
        submittedOrders[0].idempotencyKey,
      )
    } finally {
      storageApi.setItem = setItem
    }
  })
})
