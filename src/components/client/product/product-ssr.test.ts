import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('catalogue and detail SSR include selected weight and price before hydration', () => {
  // Isolate the action mock from the cart suite and render the real dropdown.
  // No database, browser, payment or notification is used.
  const script = `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { NextIntlClientProvider } from 'next-intl'
    import ukMessages from './local/uk.json'
    import enMessages from './local/en.json'

    mock.module('@/store/cart-store', () => ({
      useCartStore: (select) => select({
        addItemToCart() {}, setOpenCart() {}, hasItemInCart() { return true },
      }),
    }))
    mock.module('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams('weight=150'),
    }))
    mock.module('@/server/products/increase-product-visit.server', () => ({
      increaseProductVisit: async () => { throw new Error('SSR must not record visits') },
    }))
    const { default: Product } = await import('./src/components/client/product/index.tsx')
    const { ProductInfo } = await import('./src/components/client/product-page/product-page.tsx')
    const product = {
      _id: 'fixture', name: 'Test beef', slug: 'test-beef', category: 'jerky',
      img: '/blog-image.webp', statusLabel: [], composition: ['beef'],
      variables: [
        { weight: 30, price: 100, currency: 'UAH', count: 5 },
        { weight: 150, price: 457, currency: 'UAH', count: 5 },
      ],
    }

    for (const [locale, messages] of [['uk', ukMessages], ['en', enMessages]]) {
      const html = renderToStaticMarkup(React.createElement(
        NextIntlClientProvider,
        { locale, messages, timeZone: 'Europe/Kyiv' },
        React.createElement(Product, { product, initialVariant: product.variables[1] }),
      ))
      const trigger = html.match(/<button[^>]*role="combobox"[^>]*>.*?<\\/button>/)?.[0]
      assert.ok(trigger, 'weight trigger must be server-rendered')
      assert.ok(trigger.includes('150 ' + messages.product.g), 'selected weight must be visible before hydration')
      assert.match(html, /<p[^>]*>457 UAH<\\/p>/)
      assert.ok(html.includes('?weight=150'), 'detail URL must preserve selected weight')
      assert.ok(html.includes(messages.product['add-to-cart']), 'cart-dependent label keeps stable server fallback')
      assert.ok(!html.includes(messages.product['in-cart']), 'persisted cart state must wait for hydration')

      const detailHtml = renderToStaticMarkup(React.createElement(
        NextIntlClientProvider,
        { locale, messages, timeZone: 'Europe/Kyiv' },
        React.createElement(ProductInfo, { product, imageGallery: null }),
      ))
      const detailTrigger = detailHtml.match(/<button[^>]*role="combobox"[^>]*>.*?<\\/button>/)?.[0]
      assert.ok(detailTrigger?.includes('id="weight"'), 'detail weight trigger keeps its label association')
      assert.ok(detailTrigger.includes('150 ' + messages.product.g), 'detail selected weight must be visible before hydration')
      const heading = detailHtml.match(/<h1[^>]*>.*?<\\/h1>/)?.[0]
      assert.ok(heading?.includes('150'), 'detail heading includes selected weight')
      assert.ok(heading.includes(messages.product.g), 'detail heading includes localized unit')
      assert.match(detailHtml, /<p[^>]*>457 UAH<\\/p>/)
      assert.ok(detailHtml.includes('aria-label="' + messages.product['add-to-cart'] + '"'), 'detail buy aria-label keeps stable server fallback')
      assert.ok(detailHtml.includes(messages.product['add-to-cart']), 'detail buy text keeps stable server fallback')
      assert.ok(!detailHtml.includes(messages.product['in-cart']), 'detail persisted cart state must wait for hydration')
    }
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
