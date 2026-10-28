import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('invalid user or delivery phones cannot reach order persistence', () => {
  // Run module mocks in a separate process so the cart suite's action mock
  // cannot replace this real validation path, and no external service is used.
  const script = `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'

    const productId = '507f1f77bcf86cd799439011'
    let connections = 0
    let saves = 0
    let notifications = 0
    let savedOrder

    mock.module('next-intl/server', () => ({
      getLocale: async () => 'uk',
      getTranslations: async () => (key) => key,
    }))
    mock.module('next/server', () => ({ after: () => { notifications += 1 } }))
    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => { connections += 1 },
    }))
    mock.module('@/server/info/order-notification.server', () => ({
      sendOrderNotification: async () => { throw new Error('Must not send notifications') },
    }))
    mock.module('@/server/orders/order-schema.server', () => ({
      Order: class {
        constructor(data) {
          savedOrder = data
          this._id = 'mock-saved-order'
        }
        async save() { saves += 1 }
      },
    }))
    mock.module('@/server/products/product-schema.server', () => ({
      Product: { find: () => ({ select: () => ({ lean: async () => [{
        _id: productId,
        name: { uk: 'Яловичина', en: 'Beef' },
        variables: [{ weight: 150, price: 457, count: 5 }],
      }] }) }) },
    }))

    const { createOrderServer } = await import('./src/server/orders/create-order.server.ts')
    const orderData = {
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
        assert.equal(response.receipt, undefined)
        assert.equal(response.customerReview, undefined)
      }
    }
    assert.equal(connections, 0)
    assert.equal(saves, 0)
    assert.equal(notifications, 0)

    const validResponse = await createOrderServer(orderData)
    assert.equal(validResponse.success, true)
    assert.equal(saves, 1)
    assert.equal(savedOrder.user.phone, '+380631234567')
    assert.equal(savedOrder.delivery.phone, '+380631234567')
    assert.equal(validResponse.receipt.value, 457)
    assert.equal(validResponse.customerReview.orderId, 'mock-saved-order')
    assert.equal(validResponse.customerReview.email, 'buyer@example.test')
    assert.equal(validResponse.customerReview.deliveryCountry, 'UA')
    assert.match(validResponse.customerReview.estimatedDeliveryDate, /^\\d{4}-\\d{2}-\\d{2}$/)
    assert.equal(JSON.stringify(validResponse.receipt).includes('buyer@example.test'), false)
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
