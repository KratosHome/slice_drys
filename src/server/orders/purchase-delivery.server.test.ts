import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('the durable worker retries one private, stable purchase across overlapping runs and lost acknowledgements', () => {
  // Keep the fake database, clock and collector isolated from the cart/action suites.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    const orderId = '507f1f77bcf86cd799439011'
    const productId = '507f1f77bcf86cd799439012'
    const secondProductId = '507f1f77bcf86cd799439013'
    const row = {
      _id: orderId, createdAt: new Date('2026-01-23T09:32:10Z'), total: 154.9,
      products: [
        { id: productId, name: 'Beef', count: 2, price: 57.5, weight: 150, email: 'private@test.invalid' },
        { id: secondProductId, name: 'Plum', count: 1, price: 39.9, weight: 30 },
      ],
      user: { name: 'Private buyer', email: 'private@test.invalid', phone: 'private phone' },
      delivery: { city: 'private address' }, comment: 'private comment',
      purchaseDelivery: { state: 'pending', attempts: 0, nextAttemptAt: new Date(), clientId: '123456.123456' },
    }
    const delivery = row.purchaseDelivery
    let connections = 0, failAck = false
    function apply(update) {
      for (const [path, value] of Object.entries(update.$set ?? {})) {
        delivery[path.replace('purchaseDelivery.', '')] = value
      }
      for (const path of Object.keys(update.$unset ?? {})) {
        delete delivery[path.replace('purchaseDelivery.', '')]
      }
    }
    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => { connections++ },
    }))
    mock.module('@/server/orders/order-schema.server', () => ({
      Order: {
        findOneAndUpdate(filter, update, options) {
          assert.equal(options.returnDocument, 'after')
          assert.equal(options.timestamps, false)
          assert.equal(options.timeoutMS > 0, true)
          assert.equal(filter['purchaseDelivery.state'], 'pending')
          return { lean: async () => {
            if ((filter._id && filter._id !== row._id) ||
                delivery.state !== filter['purchaseDelivery.state'] ||
                !(delivery.nextAttemptAt <= filter['purchaseDelivery.nextAttemptAt'].$lte)) return null
            assert.equal(update.$inc['purchaseDelivery.attempts'], 1)
            apply(update)
            delivery.attempts++
            return structuredClone(row)
          } }
        },
        async updateOne(filter, update, options) {
          assert.equal(filter._id, row._id)
          assert.equal(options.timestamps, false)
          if (failAck) throw new Error('sensitive DB connection details')
          if (filter['purchaseDelivery.leaseId'] !== delivery.leaseId) return { modifiedCount: 0 }
          apply(update)
          return { modifiedCount: 1 }
        },
      }
    }))
    const bodies = []
    let status = 503, loseResponse = false, stealLease = false
    globalThis.fetch = async (url, opts) => {
      assert.equal(url.origin + url.pathname, 'https://www.google-analytics.com/mp/collect')
      assert.equal(url.searchParams.get('api_secret'), 'test secret')
      assert.equal(url.searchParams.get('measurement_id'), 'G-TEST')
      assert.equal(opts.method, 'POST')
      assert.equal(opts.redirect, 'error')
      assert.ok(opts.signal instanceof AbortSignal)
      bodies.push(JSON.parse(opts.body))
      if (stealLease) delivery.leaseId = 'replacement lease'
      if (loseResponse) throw new Error('sensitive URL details')
      return new Response(null, { status })
    }

    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'G-TEST'
    delete process.env.GA4_API_SECRET
    delete process.env.VERCEL_ENV
    const { deliverPendingPurchases } = await import('./src/server/orders/purchase-delivery.server.ts')
    await assert.rejects(deliverPendingPurchases(), /credentials/)
    assert.equal(connections, 0, 'missing credentials must not consume leases')
    process.env.GA4_API_SECRET = 'test secret'
    process.env.VERCEL_ENV = 'preview'
    assert.deepEqual(await deliverPendingPurchases(), { received: 0, retried: 0 })
    assert.equal(connections, 0)
    delete process.env.VERCEL_ENV
    assert.deepEqual(await deliverPendingPurchases({orderId: productId}), { received: 0, retried: 0 })

    const concurrent = await Promise.all([deliverPendingPurchases(), deliverPendingPurchases()])
    assert.equal(concurrent.reduce((n,result) => n + result.retried, 0), 1)
    assert.equal(bodies.length, 1, 'concurrent cron and checkout must share one lease')
    assert.equal(delivery.state, 'pending')
    assert.equal(delivery.leaseId, undefined)
    assert.equal(delivery.lastError, 'HTTP 503')
    assert.ok(delivery.nextAttemptAt > new Date())
    assert.equal(delivery.attempts, 1)
    const { getOrderReceipt } = await import('./src/server/orders/order-receipt.ts')
    const receipt = getOrderReceipt(row)
    assert.equal(receipt.transactionId, orderId)
    assert.equal(receipt.value, 154.9)
    assert.equal(receipt.value, receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0))
    assert.deepEqual(receipt.items, [
      { id: productId, name: 'Beef', quantity: 2, weight: 150, price: 57.5 },
      { id: secondProductId, name: 'Plum', quantity: 1, weight: 30, price: 39.9 },
    ])
    assert.deepEqual(bodies[0], {
      client_id: delivery.clientId,
      timestamp_micros: row.createdAt.getTime() * 1000,
      events: [{ name: 'purchase', params: {
        transaction_id: receipt.transactionId, currency: 'UAH', value: receipt.value,
        items: [
          { item_id: productId, item_name: 'Beef', item_variant: '150 g', price: 57.5, quantity: 2 },
          { item_id: secondProductId, item_name: 'Plum', item_variant: '30 g', price: 39.9, quantity: 1 },
        ],
      }}],
    })
    assert.doesNotMatch(JSON.stringify(bodies[0]), /private|phone|email|address|comment/i)
    assert.deepEqual(await deliverPendingPurchases(), { received: 0, retried: 0 })

    // Network error after a possible acceptance keeps this exact purchase pending.
    loseResponse = true
    delivery.nextAttemptAt = new Date(0)
    assert.deepEqual(await deliverPendingPurchases(), { received: 0, retried: 1 })
    assert.equal(delivery.lastError, 'Collector unavailable')
    assert.equal(delivery.state, 'pending')
    loseResponse = false
    status = 204
    delivery.nextAttemptAt = new Date(0)
    failAck = true
    await assert.rejects(deliverPendingPurchases(), /^Error: Purchase delivery database unavailable$/)
    assert.equal(delivery.state, 'pending')
    assert.ok(delivery.leaseId)
    assert.ok(delivery.nextAttemptAt > new Date())
    assert.deepEqual(await deliverPendingPurchases(), { received: 0, retried: 0 })
    failAck = false

    // An expired worker finishing late must not acknowledge another worker's lease.
    stealLease = true
    delivery.nextAttemptAt = new Date(0)
    assert.deepEqual(await deliverPendingPurchases(), { received: 0, retried: 0 })
    assert.equal(delivery.state, 'pending')
    assert.equal(delivery.leaseId, 'replacement lease')
    stealLease = false
    delivery.nextAttemptAt = new Date(0)
    assert.deepEqual(await deliverPendingPurchases({ orderId, limit: 1 }), { received: 1, retried: 0 })
    assert.equal(delivery.state, 'received')
    assert.ok(delivery.receivedAt instanceof Date)
    assert.equal(delivery.leaseId, undefined)
    assert.equal(delivery.lastError, undefined)
    assert.equal(delivery.nextAttemptAt, undefined)
    assert.deepEqual(await deliverPendingPurchases(), { received: 0, retried: 0 })
    assert.equal(bodies.length, 5)
    for (const body of bodies) assert.deepEqual(body, bodies[0])
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
