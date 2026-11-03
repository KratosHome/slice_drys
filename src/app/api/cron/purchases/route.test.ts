import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('the scheduled purchase worker runs only for authenticated requests', () => {
  const result = spawnSync(
    process.execPath,
    [
      '-e',
      `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'

    let calls = 0
    let retried = 0
    mock.module('@/server/orders/purchase-delivery.server', () => ({
      deliverPendingPurchases: async () => {
        calls++
        return { received: 1, retried }
      },
    }))
    const { GET } = await import('./src/app/api/cron/purchases/route.ts')
    const call = (authorization = '') => GET(new Request('https://example.test/api/cron/purchases', {
      headers: { authorization },
    }))
    delete process.env.CRON_SECRET
    assert.equal((await call('Bearer undefined')).status, 401)
    process.env.CRON_SECRET = 'test-only-secret'
    assert.equal((await call()).status, 401)
    assert.equal((await call('Bearer wrong-test-value')).status, 401)
    assert.equal(calls, 0)
    const ok = await call('Bearer test-only-secret')
    assert.equal(ok.status, 200)
    assert.deepEqual(await ok.json(), { received: 1, retried: 0 })
    assert.match(ok.headers.get('Cache-Control'), /no-store/)
    retried = 1
    assert.equal((await call('Bearer test-only-secret')).status, 503)
    assert.equal(calls, 2)
  `,
    ],
    { encoding: 'utf8', timeout: 10_000 },
  )
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, result.stderr || result.stdout)
})
