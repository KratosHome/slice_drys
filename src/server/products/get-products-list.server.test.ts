import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('catalogue weight bounds filter returned packs and product pagination consistently', () => {
  // Isolate database mocks; exercise the real loader and its response projection.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'

    const root = { _id: 'root-id', slug: 'meat', parentCategory: null }
    const variant = weight => ({
      _id: 'pack-' + weight, weight, price: weight * 3 + 7,
      newPrice: weight * 2 + 7, currency: 'UAH', count: weight + 2, sold: 8,
    })
    const product = (id, weights) => ({
      _id: id, slug: id, name: { uk: 'Назва ' + id, en: 'Name ' + id },
      description: { uk: 'Опис ' + id, en: 'Description ' + id },
      metaDescription: { uk: 'Мета ' + id, en: 'Metadata ' + id },
      img: '/' + id + '.webp', statusLabel: ['sale'], categories: [root],
      variables: weights.map(variant),
    })
    const documents = [
      product('all-packs', [30, 50, 100, 150]),
      product('gap-packs', [30, 150]),
      product('small-only', [30]),
      product('large-only', [200]),
    ]
    const freeze = value => {
      if (value && typeof value === 'object') {
        Object.values(value).forEach(freeze)
        Object.freeze(value)
      }
      return value
    }
    freeze(documents)
    const original = JSON.stringify(documents)
    let queries = [], countQueries = [], cursors = []
    let connections = 0

    // This fixture only evaluates the weight predicate. It deliberately checks
    // both bounds against the same pack rather than emulating a whole database.
    const matches = (document, query) => {
      const bounds = query.variables?.$elemMatch?.weight
      if (!bounds) return true
      return document.variables.some(pack =>
        (bounds.$gte === undefined || pack.weight >= bounds.$gte) &&
        (bounds.$lte === undefined || pack.weight <= bounds.$lte),
      )
    }
    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => { connections++ },
    }))
    mock.module('@/server/categories/categories-schema.server', () => ({
      Category: { findOne: async query => {
        assert.deepEqual(query, { slug: 'meat' })
        return root
      } },
    }))
    mock.module('@/server/products/product-schema.server', () => ({
      Product: {
        find: query => {
          queries.push(query)
          const selected = documents.filter(document => matches(document, query))
          const cursor = { skip: 0, limit: Infinity }
          cursors.push(cursor)
          const chain = {
            sort(order) { assert.deepEqual(order, { visited: -1, _id: 1 }); return chain },
            skip(value) { cursor.skip = value; return chain },
            limit(value) { cursor.limit = value; return chain },
            populate(path, fields) {
              assert.equal(path, 'categories')
              assert.equal(fields, 'slug parentCategory')
              return chain
            },
            lean: async () => selected.slice(cursor.skip, cursor.skip + cursor.limit),
          }
          return chain
        },
        countDocuments: async query => {
          countQueries.push(query)
          return documents.filter(document => matches(document, query)).length
        },
      },
    }))

    const { getProductsList } = await import('./src/server/products/get-products-list.server.ts')
    const run = async (options, expectedBounds, expectedRows, totalItems, limit = 10, page = 1) => {
      queries = []; countQueries = []; cursors = []
      const result = await getProductsList({ page, limit, menu: 'meat', locale: 'uk', ...options })
      assert.equal(result.success, true, result.message)
      assert.equal(queries.length, 1)
      assert.equal(countQueries.length, 1)
      assert.equal(countQueries[0], queries[0], 'rows and total use the identical query')
      assert.equal(queries[0].categories, root._id)
      assert.ok(!('variables.weight' in queries[0]), 'separate array elements must not satisfy opposite bounds')
      if (expectedBounds) {
        assert.deepEqual(queries[0].variables, { $elemMatch: { weight: expectedBounds } })
      } else {
        assert.ok(!('variables' in queries[0]), 'unfiltered requests have no pack restriction')
      }
      assert.deepEqual(cursors, [{ skip: (page - 1) * limit, limit }])
      assert.deepEqual(result.data.map(item => [item.slug, item.variables.map(pack => pack.weight)]), expectedRows)
      assert.equal(result.totalItems, totalItems, 'count products rather than visible pack cards')
      assert.equal(result.totalPages, Math.ceil(totalItems / limit))
      assert.equal(result.currentPage, page)
      assert.equal(JSON.stringify(documents), original, 'reading a filtered list must not mutate source packs')
      return result
    }

    const range = await run(
      { minWeight: '40', maxWeight: '150' }, { $gte: 40, $lte: 150 },
      [['all-packs', [50, 100, 150]], ['gap-packs', [150]]], 2,
    )
    assert.ok(range.data.every(item => item.variables.every(pack => pack.weight >= 40 && pack.weight <= 150)))
    assert.deepEqual(range.data[0].variables, documents[0].variables.slice(1), 'prices, discounts, stock and IDs survive pack filtering')

    await run(
      { minWeight: '40', maxWeight: '100' }, { $gte: 40, $lte: 100 },
      [['all-packs', [50, 100]]], 1,
    )
    await run(
      { minWeight: '100' }, { $gte: 100 },
      [['all-packs', [100, 150]], ['gap-packs', [150]], ['large-only', [200]]], 3,
    )
    await run(
      { maxWeight: '50' }, { $lte: 50 },
      [['all-packs', [30, 50]], ['gap-packs', [30]], ['small-only', [30]]], 3,
    )
    await run(
      { minWeight: '100', maxWeight: '100' }, { $gte: 100, $lte: 100 },
      [['all-packs', [100]]], 1,
    )
    await run({ minWeight: '40', maxWeight: '49' }, { $gte: 40, $lte: 49 }, [], 0)
    await run({ maxWeight: '0' }, { $lte: 0 }, [], 0)

    // Three allowed packs on page one still represent one product per page.
    await run(
      { minWeight: '40', maxWeight: '150' }, { $gte: 40, $lte: 150 },
      [['all-packs', [50, 100, 150]]], 2, 1, 1,
    )
    await run(
      { minWeight: '40', maxWeight: '150' }, { $gte: 40, $lte: 150 },
      [['gap-packs', [150]]], 2, 1, 2,
    )

    const unfilteredRows = documents.map(document => [document.slug, document.variables.map(pack => pack.weight)])
    const unfiltered = await run({}, undefined, unfilteredRows, 4)
    const emptyBounds = await run({ minWeight: '', maxWeight: '' }, undefined, unfilteredRows, 4)
    assert.deepEqual(emptyBounds.data, unfiltered.data)
    for (const [index, item] of unfiltered.data.entries()) {
      const source = documents[index]
      assert.deepEqual(item.variables, source.variables)
      assert.equal(item.name, source.name.uk)
      assert.equal(item.description, source.description.uk)
      assert.equal(item.metaDescription, source.metaDescription.uk)
      assert.equal(item.img, source.img)
      assert.deepEqual(item.statusLabel, source.statusLabel)
      assert.equal(item.category, 'meat')
      assert.deepEqual(item.categories, ['root-id'])
    }
    const english = await run({ locale: 'en', minWeight: '100', maxWeight: '100' }, { $gte: 100, $lte: 100 }, [['all-packs', [100]]], 1)
    assert.equal(english.data[0].name, 'Name all-packs')
    assert.equal(english.data[0].description, 'Description all-packs')
    assert.notEqual(unfiltered.data[0].variables[0], documents[0].variables[0], 'response variants remain detached plain values')
    unfiltered.data[0].variables[0].price = -1
    assert.equal(JSON.stringify(documents), original)
    assert.ok(connections > 0, 'real loader uses the mocked connection only')
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
