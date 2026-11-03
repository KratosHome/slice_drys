import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('order validation, retries and side effects at the MongoDB write boundary', () => {
  // Run module mocks in a separate process so the cart suite's action mock
  // cannot replace this real validation path, and no external service is used.
  const script = `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'

    const productId = '507f1f77bcf86cd799439011'
    let connections = 0
    let indexReady = false
    let saveAttempts = 0
    let loseAck = false
    let failScheduling = false
    let failReview = false
    let failBeforeWrite = false
    let available = true
    let catalogPrice = 457
    let staleRead = false
    let cookieValue = 'GA1.1.1234567890.1234567890'
    const orders = new Map()
    const tasks = []
    let notifications = 0
    let deliveries = 0

    mock.module('next-intl/server', () => ({
      getLocale: async () => 'uk',
      getTranslations: async () => (key) => key,
    }))
    mock.module('next/server', () => ({ after: (task) => {
      if (failScheduling) throw new Error('after is unavailable')
      tasks.push(task)
    } }))
    mock.module('next/headers', () => ({
      cookies: async () => ({ get: () => ({ value: cookieValue }) }),
    }))
    mock.module('@/server/orders/purchase-delivery.server', () => ({
      purchaseDeliveryEnabled: () => true,
      deliverPendingPurchases: async () => { deliveries += 1; throw new Error('GA unavailable') },
    }))
    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => { connections += 1 },
    }))
    mock.module('@/server/info/order-notification.server', () => ({
      sendOrderNotification: async () => { notifications += 1; throw new Error('Telegram unavailable') },
    }))
    const { createCustomerReviewOrder: makeReview } = await import('./src/server/orders/customer-review.server.ts')
    mock.module('@/server/orders/customer-review.server', () => ({
      createCustomerReviewOrder: (...args) => {
        if (failReview) throw new Error('Could not calculate delivery date')
        return makeReview(...args)
      },
    }))
    // BSON probes V8 while loading. Bun 1.3 exposes this method but throws
    // instead of reporting false in this ordinary (non-snapshot) test process.
    process.getBuiltinModule('v8').startupSnapshot.isBuildingSnapshot = () => false
    const { Order } = await import('./src/server/orders/order-schema.server.ts')
    Order.collection.createIndex = async (fields, options) => {
      assert.deepEqual(fields, { idempotencyKey: 1 })
      assert.equal(options.unique, true)
      assert.deepEqual(options.partialFilterExpression, { idempotencyKey: { $type: 'string' } })
      indexReady = true
      return 'idempotencyKey_1'
    }
    Order.findOne = ({ idempotencyKey }) => ({
      read: (preference) => {
        assert.equal(preference, 'primary')
        return { readConcern: (level) => {
          assert.equal(level, 'majority')
          return { select: () => ({ lean: async () => {
            if (staleRead) { staleRead = false; return null }
            return orders.get(idempotencyKey)
          } }) }
        } }
      },
    })
    Order.prototype.save = async function (options) {
      saveAttempts += 1
      assert.ok(indexReady)
      assert.equal(options.w, 'majority')
      await this.validate()
      if (orders.has(this.idempotencyKey)) {
        staleRead = true
        throw Object.assign(new Error('Duplicate key'), { code: 11000 })
      }
      if (failBeforeWrite) throw new Error('DB unavailable')
      this.createdAt = new Date()
      orders.set(this.idempotencyKey, this.toObject())
      if (loseAck) throw new Error('Lost write acknowledgement')
    }
    mock.module('@/server/products/product-schema.server', () => ({
      Product: { find: () => ({ select: () => ({ lean: async () => available ? [{
        _id: productId,
        name: { uk: 'Яловичина', en: 'Beef' },
        variables: [{ weight: 150, price: catalogPrice, count: 5 }],
      }] : [] }) }) },
    }))

    const { createOrderServer } = await import('./src/server/orders/create-order.server.ts')
    const orderData = {
      idempotencyKey: crypto.randomUUID(),
      products: [{ id: productId, count: 1, weight: 150 }],
      user: { name: 'Test', surname: 'Buyer', phone: '+38 (063) 123 45 67', email: 'buyer@example.test' },
      delivery: { city: 'Test city', department: 'Test branch', phone: '0631234567' },
      payment: { method: 'cash' }, comment: '',
    }

    for (const invalidPhone of ['+38 (063)', '+38063123456', '+38063123abc4567', 'not a phone', '']) {
      for (const field of ['user', 'delivery']) {
        const response = await createOrderServer({
          ...orderData,
          [field]: { ...orderData[field], phone: invalidPhone },
        })
        assert.equal(response.success, false, field + ': ' + invalidPhone)
        assert.equal(response.errorCode, 'invalid_order')
        assert.equal(response.receipt, undefined)
        assert.equal(response.customerReview, undefined)
      }
    }
    assert.equal(connections, 0)
    assert.equal(saveAttempts, 0)
    assert.equal(notifications, 0)

    for (const idempotencyKey of [null, '', 'predictable', 123]) {
      assert.equal((await createOrderServer({ ...orderData, idempotencyKey })).success, false)
    }
    const [validResponse, racingResponse] = await Promise.all([
      createOrderServer(orderData), createOrderServer(orderData),
    ])
    const savedOrder = orders.get(orderData.idempotencyKey)
    assert.equal(validResponse.success, true)
    assert.equal(validResponse.errorCode, undefined)
    assert.deepEqual(validResponse, racingResponse)
    assert.equal(saveAttempts, 2)
    assert.equal(orders.size, 1)
    assert.equal(savedOrder.user.phone, '+380631234567')
    assert.equal(savedOrder.delivery.phone, '+380631234567')
    assert.equal(validResponse.receipt.value, 457)
    assert.equal(validResponse.customerReview.orderId, savedOrder._id.toString())
    assert.equal(validResponse.customerReview.email, 'buyer@example.test')
    assert.equal(validResponse.customerReview.deliveryCountry, 'UA')
    assert.match(validResponse.customerReview.estimatedDeliveryDate, /^\\d{4}-\\d{2}-\\d{2}$/)
    assert.equal(JSON.stringify(validResponse.receipt).includes('buyer@example.test'), false)
    assert.equal(savedOrder.purchaseDelivery.state, 'pending')
    assert.equal(savedOrder.purchaseDelivery.clientId, '1234567890.1234567890')
    assert.equal(tasks.length, 2)
    await Promise.all(tasks.map((run) => run()))
    assert.equal(notifications, 1)
    assert.equal(deliveries, 1)

    available = false
    assert.deepEqual(await createOrderServer(orderData), validResponse)
    // A request that missed the winning insert on its first read can still
    // recover it if the catalog has since removed the product.
    staleRead = true
    assert.deepEqual(await createOrderServer(orderData), validResponse)
    const conflict = await createOrderServer({
      ...orderData, user: { ...orderData.user, email: 'other@example.test' },
    })
    assert.equal(conflict.success, false)
    assert.equal(conflict.errorCode, 'idempotency_conflict')
    const unavailable = await createOrderServer({
      ...orderData, idempotencyKey: crypto.randomUUID(),
    })
    assert.equal(unavailable.errorCode, 'product_unavailable')
    assert.equal(tasks.length, 2)
    assert.equal(saveAttempts, 2)

    // Unknown write outcome, including a lost acknowledgement after commit.
    available = true
    catalogPrice = 50
    const belowMinimum = await createOrderServer({
      ...orderData, idempotencyKey: crypto.randomUUID(),
    })
    assert.equal(belowMinimum.errorCode, 'minimum_order_amount')
    catalogPrice = 457
    loseAck = true
    cookieValue = 'buyer@example.test'
    const cardOrder = { ...orderData, payment: { method: 'card' }, idempotencyKey: crypto.randomUUID() }
    const reconciled = await createOrderServer(cardOrder)
    assert.equal(reconciled.success, true)
    assert.notEqual(reconciled.receipt.transactionId, validResponse.receipt.transactionId)
    assert.deepEqual(await createOrderServer(cardOrder), reconciled)
    const cardDelivery = orders.get(cardOrder.idempotencyKey).purchaseDelivery
    assert.equal(cardDelivery.state, 'pending')
    assert.match(cardDelivery.clientId, /^[0-9a-f-]{36}$/)
    assert.equal(tasks.length, 4)
    await Promise.all(tasks.slice(2).map((run) => run()))
    assert.equal(notifications, 2)
    assert.equal(deliveries, 2)

    // A definite failure is retryable, and a broken post-save scheduler can't
    // turn a subsequent successful write into a failed checkout.
    const retryOrder = { ...orderData, idempotencyKey: crypto.randomUUID() }
    loseAck = false
    failBeforeWrite = true
    const unconfirmed = await createOrderServer(retryOrder)
    assert.equal(unconfirmed.success, false)
    assert.equal(unconfirmed.errorCode, 'order_unconfirmed')
    assert.equal(unconfirmed.message.uk, 'unconfirmed')
    assert.equal(orders.size, 2)
    failBeforeWrite = false
    failScheduling = true
    failReview = true
    const result = await createOrderServer(retryOrder)
    assert.equal(result.success, true)
    assert.equal(result.receipt.value, 457)
    assert.equal(result.customerReview, undefined)
    assert.deepEqual(await createOrderServer(retryOrder), result)
    assert.equal(orders.size, 3)
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
