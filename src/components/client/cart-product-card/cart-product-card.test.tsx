import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('cart cards localize a persisted item and expose a named native remove button', () => {
  // Bun module mocks stay in a child process so the real cart-store suite keeps
  // its own module instance. No browser, storage, animation or cart mutation runs.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import ukMessages from './local/uk.json'
    import enMessages from './local/en.json'

    const messages = { uk: ukMessages, en: enMessages }
    let locale = 'uk'
    mock.module('next-intl', () => ({
      useLocale: () => locale,
      useTranslations: namespace => key => messages[locale][namespace][key],
    }))
    mock.module('next/image', () => ({
      default: props => React.createElement('img', props),
    }))
    mock.module('@/components/client/responsive-motion', () => ({
      ResponsiveMotion: ({ children, className, onClick }) =>
        React.createElement('div', { className, onClick }, children),
    }))
    mock.module('@/store/cart-store', () => ({
      useCartStore: select => select({
        removeItemFromCart() { throw new Error('SSR must not remove cart items') },
        updateItemQuantity() { throw new Error('SSR must not update quantities') },
      }),
    }))
    const { default: CartProductCard } = await import('./src/components/client/cart-product-card/index.tsx')
    const item = Object.freeze({
      id: 'persisted-apple', name: 'Legacy apple name',
      names: Object.freeze({ uk: 'Яблуко з корицею', en: 'Apple with cinnamon' }),
      image: '/apple.webp', weight: 30, quantity: 2, maxQuantity: 5, price: 120,
    })
    const original = JSON.stringify(item)
    const visibleText = html => html.replace(/<[^>]*>/g, '')
    const render = value => renderToStaticMarkup(React.createElement(CartProductCard, { itemData: value }))
    const check = (value, expectedName) => {
      const html = render(value)
      assert.ok(visibleText(html).includes(expectedName), 'visible product name follows the active locale or legacy fallback')
      const image = html.match(/<img\b[^>]*>/)?.[0]
      assert.ok(image?.includes('alt="' + expectedName + '"'), 'image alternative text uses the same product name')
      const removeButtons = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)]
        .map(match => match[0]).filter(button => /\bdata-cart-remove(?:=|\s|>)/.test(button))
      assert.equal(removeButtons.length, 1, 'each cart line exposes exactly one remove control')
      const button = removeButtons[0]
      const openingTag = button.match(/^<button\b[^>]*>/)[0]
      assert.match(openingTag, /\btype="button"/)
      const expectedLabel = messages[locale].cart.delete + ': ' + expectedName + ', ' + value.weight + ' ' + messages[locale].cart.g
      assert.ok(openingTag.includes('aria-label="' + expectedLabel + '"'), 'remove name identifies the localized product and exact pack weight')
      const svg = button.match(/<svg\b[^>]*>/)?.[0]
      assert.ok(svg, 'remove button keeps its decorative icon')
      assert.match(svg, /\baria-hidden="true"/)
      assert.match(svg, /\bfocusable="false"/)
      return html
    }

    // Re-render the same immutable persisted object as the customer switches locale.
    for (const activeLocale of ['uk', 'en', 'uk']) {
      locale = activeLocale
      const html = check(item, item.names[locale])
      const otherLocale = locale === 'uk' ? 'en' : 'uk'
      assert.ok(!visibleText(html).includes(item.names[otherLocale]), 'the previous locale name must not remain visible')
      assert.ok(!visibleText(html).includes(item.name), 'legacy text does not override available translated names')
      check({ ...item, weight: 150 }, item.names[locale])
    }
    for (const activeLocale of ['uk', 'en']) {
      locale = activeLocale
      const { names, ...legacyItem } = item
      check(legacyItem, item.name)
      check({ ...item, names: {} }, item.name)
      check({ ...item, names: { [locale]: '' } }, item.name)
    }
    assert.equal(JSON.stringify(item), original, 'locale changes must not mutate the persisted item')
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
