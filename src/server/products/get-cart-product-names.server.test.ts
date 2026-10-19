import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('cart name enrichment validates IDs, exposes only localized names, and retries failures', () => {
  // Isolate mocks from other suites and never connect to a real database.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'

    const first = '507f1f77bcf86cd799439011'
    const second = '507f1f77bcf86cd799439012'
    const third = '507f1f77bcf86cd799439013'
    let connections = 0
    let reads = 0
    let cacheCalls = 0
    let cacheDefinition
    let failure
    let documents = []
    const queries = []

    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => {
        connections += 1
        if (failure === 'connect') throw new Error('Private connection detail')
      },
    }))
    mock.module('@/server/products/product-schema.server', () => ({
      Product: {
        find: (filter, projection) => {
          reads += 1
          queries.push({ filter, projection })
          return { lean: async () => {
            if (failure === 'read') throw new Error('Private database detail')
            return documents
          } }
        },
      },
    }))
    mock.module('next/cache', () => ({
      unstable_cache: (loader, keys, options) => {
        cacheDefinition = { keys, options }
        const cache = new Map()
        return async (...args) => {
          cacheCalls += 1
          const key = JSON.stringify(args)
          if (cache.has(key)) return cache.get(key)
          const value = await loader(...args)
          cache.set(key, value)
          return value
        }
      },
    }))

    const { getCartProductNames } = await import('./src/server/products/get-cart-product-names.server.ts')
    for (const invalid of [undefined, null, first, {}, [], Array(1), [first, null], [first, 7],
      [first, { $ne: null }], ['not-an-id'], ['g'.repeat(24)], [' ' + first],
      Array.from({ length: 101 }, () => first)]) {
      assert.deepEqual(await getCartProductNames(invalid), [])
    }
    assert.equal(connections, 0, 'invalid batches must not reach the database')
    assert.equal(cacheCalls, 0, 'invalid batches must not allocate cache entries')

    documents = [
      {
        _id: { toString: () => second },
        name: { uk: '  Яловичина  ', en: ' Beef ', internal: 'private-name' },
        variables: [{ sold: 12, count: 7 }], visited: 99, privateField: 'private',
      },
      { _id: { toString: () => first }, name: { uk: 'Яблуко', en: '' } },
      { _id: { toString: () => third }, name: { uk: null, en: 12 } },
      { _id: { toString: () => '507f1f77bcf86cd799439099' }, name: { en: 'Not requested' } },
    ]
    const result = await getCartProductNames([third, second.toUpperCase(), first, second])
    assert.deepEqual(queries[0], {
      filter: { _id: { $in: [first, second, third] } },
      projection: { _id: 1, 'name.uk': 1, 'name.en': 1 },
    })
    assert.deepEqual(result, [
      { id: second, names: { uk: 'Яловичина', en: 'Beef' } },
      { id: first, names: { uk: 'Яблуко' } },
    ])
    assert.deepEqual(JSON.parse(JSON.stringify(result)), result, 'server action payload contains plain public values only')
    assert.doesNotMatch(JSON.stringify(result), /private|variables|visited|sold|count|Not requested/)

    assert.deepEqual(cacheDefinition, {
      keys: ['public-cart-product-names-v1'],
      options: { revalidate: 86400, tags: ['products', 'product'] },
    })
    assert.deepEqual(await getCartProductNames([first, third, second]), result)
    assert.equal(reads, 1, 'equivalent deduplicated ID batches use the same cache input')

    // Errors are caught outside the cached loader, so fallback [] cannot poison its key.
    const recoverable = '507f1f77bcf86cd799439014'
    failure = 'connect'
    assert.deepEqual(await getCartProductNames([recoverable]), [])
    failure = 'read'
    assert.deepEqual(await getCartProductNames([recoverable]), [])
    failure = undefined
    documents = [{ _id: { toString: () => recoverable }, name: { uk: 'Груша', en: 'Pear' } }]
    assert.deepEqual(await getCartProductNames([recoverable]), [
      { id: recoverable, names: { uk: 'Груша', en: 'Pear' } },
    ])

    // Exactly 100 valid IDs are supported; products removed from the catalogue are omitted.
    documents = []
    const maximumBatch = Array.from({ length: 100 }, (_, i) => i.toString(16).padStart(24, '0'))
    assert.deepEqual(await getCartProductNames(maximumBatch), [])
    assert.deepEqual(queries.at(-1).filter, { _id: { $in: maximumBatch } })
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
