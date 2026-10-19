import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('category client cards omit server descriptions without changing variants or JSON-LD', () => {
  // Exercise the actual server page boundary with isolated data and no database.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import { getProductAnalyticsItem } from './src/utils/analytics'

    const full = {
      _id: '507f1f77bcf86cd799439011', name: 'Test beef', slug: 'test-beef', category: 'meat',
      img: '/beef.webp', statusLabel: ['sale'],
      description: 'Server-only article '.repeat(100), metaDescription: 'Server-only metadata',
      categories: ['server-category-id'], images: ['/unused.webp'],
      variables: [
        { _id: 1, weight: 30, price: 100, currency: 'UAH', count: 8, sold: 20 },
        { _id: 2, weight: 150, price: 500, newPrice: 457, currency: 'UAH', count: 4, sold: 50 },
      ],
    }
    const original = JSON.stringify(full)
    const category = { slug: 'meat', parentCategory: null, name: { uk: 'М’ясо', en: 'Meat' }, h1: { uk: 'М’ясо', en: 'Meat' } }
    const serverResult = { success: true, data: [full], currentPage: 1, totalItems: 1, totalPages: 1 }
    function Product() { return null }
    function ProductListJsonLd() { return null }
    function ProductListTracking() { return null }

    mock.module('@/components/client/product', () => ({ default: Product }))
    mock.module('@/components/client/product-filters/product-filters', () => ({ default: () => null }))
    mock.module('@/components/client/json-ld/product-list-json-ld', () => ({ default: ProductListJsonLd }))
    mock.module('@/components/google-analytics/product-list-tracking', () => ({ default: ProductListTracking }))
    mock.module('next/navigation', () => ({
      notFound() { throw new Error('Unexpected notFound') },
      permanentRedirect() { throw new Error('Unexpected redirect') },
    }))
    mock.module('next-intl/server', () => ({
      getTranslations: async () => key => key,
      getMessages: async () => ({}),
    }))
    mock.module('@/server/public-data-cache.server', () => ({
      getPublicCurrentCategory: async () => ({ success: true, data: category }),
      getPublicCategories: async () => ({ success: true, data: [], name: 'М’ясо' }),
      getPublicProductsList: async () => serverResult,
      getPublicProductWeights: async () => ({ success: true, data: [30, 150] }),
    }))

    const { default: ProductsPage } = await import('./src/app/(app)/[locale]/(client)/products/[[...categories]]/page.tsx')
    const page = await ProductsPage({ params: Promise.resolve({ locale: 'uk', categories: ['meat'] }), searchParams: Promise.resolve({}) })
    const elements = []
    const visit = element => {
      if (Array.isArray(element)) { element.forEach(visit); return }
      if (!element || typeof element !== 'object' || !element.props) return
      elements.push(element)
      visit(element.props.children)
    }
    visit(page)
    const cards = elements.filter(element => element.type === Product)
    assert.equal(cards.length, 2, 'each existing pack keeps its own card')
    for (const [index, { props }] of cards.entries()) {
      const sourceVariant = full.variables[index]
      const payload = JSON.stringify(props)
      assert.doesNotMatch(payload, /Server-only|server-category-id|unused.webp|"sold"/)
      assert.equal(props.initialVariant, props.product.variables[index], 'selected pack reuses its compact card variant')
      for (const field of ['weight', 'price', 'newPrice', 'currency', 'count']) {
        assert.equal(props.initialVariant[field], sourceVariant[field], field)
      }
      assert.deepEqual(getProductAnalyticsItem(props.product, props.initialVariant), getProductAnalyticsItem(full, sourceVariant))
    }
    const structuredData = elements.find(element => element.type === ProductListJsonLd)
    assert.equal(structuredData.props.productsData, serverResult, 'JSON-LD still receives the full server data')
    const tracking = elements.find(element => element.type === ProductListTracking)
    assert.deepEqual(tracking.props.items, full.variables.map(variable => getProductAnalyticsItem(full, variable)))
    assert.equal(JSON.stringify(full), original, 'the source record is not mutated')
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
