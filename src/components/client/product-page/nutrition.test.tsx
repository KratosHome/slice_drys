import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('nutrition SSR shares the purchase variant and respects explicit or unknown energy units', () => {
  // Keep module mocks private to this process, as in the product SSR suite.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { NextIntlClientProvider } from 'next-intl'
    import ukMessages from './local/uk.json'
    import enMessages from './local/en.json'

    let query = ''
    mock.module('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams(query),
    }))
    mock.module('@/store/cart-store', () => ({
      useCartStore: (select) => select({
        addItemToCart() {}, setOpenCart() {}, hasItemInCart() { return false },
      }),
    }))
    mock.module('@/server/products/increase-product-visit.server', () => ({
      increaseProductVisit: async () => { throw new Error('SSR must not record visits') },
    }))

    const { ProductNutrition } = await import('./src/components/client/product-page/nutrition.tsx')
    const { ProductInfo } = await import('./src/components/client/product-page/product-page.tsx')
    const { ProductVariantProvider } = await import('./src/components/client/product-page/product-variant-provider.tsx')

    const variants = [30, 50, 100, 150].map(weight => Object.freeze({
      weight, price: weight * 3 + 7, currency: 'UAH', count: 5,
    }))
    const product = Object.freeze({
      _id: 'nutrition-fixture', name: 'Test beef', slug: 'test-beef', category: 'jerky',
      img: '/blog-image.webp', statusLabel: [], composition: ['beef'], variables: variants,
    })
    const nutrition = Object.freeze({
      proteins: '20', fats: '0', carbohydrates: '0.05', energyValue: '897.123',
      energyUnit: null, perGrams: null,
    })
    const originalNutrition = JSON.stringify(nutrition)
    const plain = html => html.replace(/<[^>]*>/g, '')
      .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')
      .replaceAll('&nbsp;', ' ').replaceAll('&#x27;', "'").replaceAll('&quot;', '"')
      .replace(/\s+/g, ' ').trim()
    const sections = html => [...html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)]
      .map(match => match[1]).filter(section => section.includes('<dl'))
    const rows = section => Object.fromEntries(
      [...section.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt><dd\b[^>]*>([\s\S]*?)<\/dd>/g)]
        .map(match => [plain(match[1]), plain(match[2])]),
    )
    const energyParagraphs = html => sections(html)
      .map(section => plain(section.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)[1]))

    for (const [locale, messages] of [['uk', ukMessages], ['en', enMessages]]) {
      const t = messages.product
      const baseHeading = locale === 'uk' ? 'На 100 г' : 'Per 100 g'
      const labels = locale === 'uk'
        ? ['Білки', 'Жири', 'Вуглеводи']
        : ['Protein', 'Fat', 'Carbohydrates']
      const small = locale === 'uk' ? '<0,1 г' : '<0.1 g'
      const unit = locale === 'uk' ? 'г' : 'g'
      const noData = locale === 'uk' ? 'Немає даних' : 'No data'
      const format = value => new Intl.NumberFormat(locale, { maximumFractionDigits: 1, useGrouping: false }).format(value)
      const packHeading = weight => locale === 'uk' ? 'На упаковку ' + weight + ' г' : 'Per ' + weight + ' g pack'
      const render = (value = nutrition, detail = false, selection = product, variant = 'cards') => renderToStaticMarkup(
        React.createElement(NextIntlClientProvider,
          { locale, messages, timeZone: 'Europe/Kyiv' },
          React.createElement(ProductVariantProvider, { product: selection },
            detail ? React.createElement(ProductInfo, {
              product: selection,
              imageGallery: null,
              nutritionContent: React.createElement(ProductNutrition, { nutrition: value, variant }),
            }) : React.createElement(ProductNutrition, { nutrition: value, variant }),
          ),
        ),
      )
      const assertNutrition = (html, weight, protein = 20) => {
        const cards = sections(html)
        assert.equal(cards.length, 2, 'base and pack nutrition are individually labelled')
        assert.equal(plain(cards[0].match(/<h3[^>]*>([\s\S]*?)<\/h3>/)[1]), baseHeading)
        assert.equal(plain(cards[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/)[1]), packHeading(weight))
        assert.deepEqual(rows(cards[0]), {
          [labels[0]]: format(protein) + ' ' + unit,
          [labels[1]]: '0 ' + unit,
          [labels[2]]: small,
        })
        assert.deepEqual(rows(cards[1]), {
          [labels[0]]: format(protein * weight / 100) + ' ' + unit,
          [labels[1]]: '0 ' + unit,
          [labels[2]]: small,
        })
        const energy = locale === 'uk' ? '897,123' : '897.123'
        assert.ok(plain(cards[0]).includes(t['energy-value-per-100'] + ': ' + t['energy-unit-unverified'].replace('{value}', energy)))
        assert.ok(plain(cards[1]).includes(t['energy-pack-pending']))
        assert.ok(!plain(cards[1]).includes(energy), 'pack energy must not use or scale the label number')
        assert.doesNotMatch(html, /NaN|Infinity|ккал|кДж|kcal|kJ/)
      }

      const compactRows = html => Object.fromEntries(
        [...html.matchAll(/<tr[^>]*>\s*<th\b[^>]*scope="row"[^>]*>([\s\S]*?)<\/th>([\s\S]*?)<\/tr>/g)]
          .map(match => [plain(match[1]), [...match[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(cell => plain(cell[1]))]),
      )

      // The compact table reads the same pack selection without replacing or rounding source values.
      for (const weight of [30, 50, 100, 150]) {
        query = 'weight=' + weight
        const html = render(nutrition, true, product, 'compact')
        assert.match(html, /<table\b/)
        assert.equal((html.match(/<table\b/g) || []).length, 1, 'detail slot renders one nutrition table')
        const trigger = html.match(/<button[^>]*role="combobox"[^>]*>[\s\S]*?<\/button>/)?.[0]
        assert.ok(trigger?.includes(weight + ' ' + unit), 'compact pack and purchase selection agree')
        assert.equal(plain(html.match(/<caption[^>]*>([\s\S]*?)<\/caption>/)[1]), t['nutritional-value'])
        const columnLabels = [...html.matchAll(/<th\b[^>]*scope="col"[^>]*>([\s\S]*?)<\/th>/g)].map(match => plain(match[1]))
        assert.deepEqual(columnLabels, [t['nutritional-value'], baseHeading, packHeading(weight)])
        assert.deepEqual(compactRows(html), {
          [labels[0]]: ['20 ' + unit, format(20 * weight / 100) + ' ' + unit],
          [labels[1]]: ['0 ' + unit, '0 ' + unit],
          [labels[2]]: [small, small],
        })
        assert.ok(plain(html).includes(t['energy-unit-unverified'].replace('{value}', locale === 'uk' ? '897,123' : '897.123')))
        assert.ok(plain(html).includes(packHeading(weight) + ': ' + t['energy-pack-pending']))
        assert.doesNotMatch(html, /NaN|Infinity|ккал|кДж|kcal|kJ/)
      }

      for (const energyUnit of ['kcal', 'kJ']) {
        query = 'weight=150'
        const known = { ...nutrition, energyUnit, energyValue: '320' }
        const html = render(known, false, product, 'compact')
        assert.deepEqual(compactRows(html)[t['energy']], ['320 ' + t[energyUnit], '480 ' + t[energyUnit]])
        assert.ok(!html.includes(t['energy-pack-pending']))
        for (const energyValue of ['0', null, 'invalid']) {
          const missing = render({ ...known, energyValue }, false, product, 'compact')
          const expected = energyValue === '0' ? '0 ' + t[energyUnit] : noData
          assert.deepEqual(compactRows(missing)[t['energy']], [expected, expected])
          assert.doesNotMatch(missing, /NaN|Infinity/)
        }
      }

      query = 'weight=50'
      for (const value of [null, {}, { ...nutrition, energyUnit: 'watts' }]) {
        const html = render(value, false, product, 'compact')
        assert.equal(Object.keys(compactRows(html)).length, 3, 'unverified units never authorize a pack energy calculation')
        assert.ok(plain(html).includes(t['energy-pack-pending']))
        assert.doesNotMatch(html, /NaN|Infinity|ккал|кДж|kcal|kJ/)
        if (!value || !value.proteins) {
          assert.deepEqual(compactRows(html), Object.fromEntries(labels.map(label => [label, [noData, noData]])))
        }
      }

      // All four pack sizes and repeated switches use the very same variant as purchase details.
      for (const weight of [30, 50, 100, 150, 30, 150, 50, 100]) {
        query = 'weight=' + weight
        const html = render(nutrition, true)
        assertNutrition(html, weight)
        const trigger = html.match(/<button[^>]*role="combobox"[^>]*>[\s\S]*?<\/button>/)?.[0]
        assert.ok(trigger?.includes(weight + ' ' + unit), 'purchase selection and pack calculation agree')
        assert.ok(plain(html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)[0]).includes(weight + ' ' + unit))
        assert.match(html, new RegExp('<p[^>]*>' + (weight * 3 + 7) + ' UAH<\\/p>'))
        assert.ok(html.includes('aria-label="' + t['add-to-cart'] + '"'))
      }

      // Display precision never becomes a new calculation base, including legacy metadata.
      const precise = Object.freeze({ ...nutrition, proteins: '20.123456', energyUnit: null, perGrams: 30 })
      for (const weight of [30, 150, 50, 100, 30, 100]) {
        query = 'weight=' + weight
        assertNutrition(render(precise), weight, 20.123456)
      }
      assert.equal(precise.proteins, '20.123456')

      // Only a recognized database unit authorizes scaling energy; preserve that same unit.
      for (const [energyUnit, energyValue, amounts] of [
        ['kcal', '320', { 30: 96, 50: 160, 100: 320, 150: 480 }],
        ['kJ', '1340', { 30: 402, 50: 670, 100: 1340, 150: 2010 }],
      ]) {
        const known = Object.freeze({ ...nutrition, energyUnit, energyValue })
        const originalKnown = JSON.stringify(known)
        for (const weight of [30, 50, 100, 150, 30, 150, 100]) {
          query = 'weight=' + weight
          const html = render(known)
          const lines = energyParagraphs(html)
          assert.equal(lines[0], t['energy-value-per-100'] + ': ' + energyValue + ' ' + t[energyUnit])
          assert.equal(lines[1], t['energy-value'] + ': ' + amounts[weight] + ' ' + t[energyUnit])
          assert.ok(!html.includes(t['energy-pack-pending']), 'known energy must be calculated immediately')
          assert.ok(!plain(html).includes(t['energy-unit-unverified'].replace('{value}', energyValue)))
          assert.doesNotMatch(html, /NaN|Infinity/)
        }
        assert.equal(JSON.stringify(known), originalKnown, 'energy calculation must not overwrite the label value or unit')

        for (const weight of [30, 50, 100, 150]) {
          query = 'weight=' + weight
          const zero = Object.freeze({ ...known, energyValue: '0' })
          assert.deepEqual(energyParagraphs(render(zero)), [
            t['energy-value-per-100'] + ': 0 ' + t[energyUnit],
            t['energy-value'] + ': 0 ' + t[energyUnit],
          ])
          assert.equal(zero.energyValue, '0')
        }

        query = 'weight=30'
        for (const missing of [undefined, null, '', 'invalid', NaN, Infinity, -1]) {
          const invalidEnergy = Object.freeze({ ...known, energyValue: missing })
          const lines = energyParagraphs(render(invalidEnergy))
          assert.equal(lines.length, 2)
          for (const line of lines) {
            assert.ok(line.includes(noData), 'known units must not turn missing energy into zero')
            assert.ok(!line.includes('0 ' + t[energyUnit]))
          }
          assert.doesNotMatch(lines.join(' '), /NaN|Infinity/)
        }
      }

      // Absent or malformed runtime units must never be inferred from the energy magnitude.
      for (const energyUnit of [null, undefined, '', 'KCAL', 'watts', 'kJ ']) {
        const unknown = Object.freeze({ ...nutrition, energyUnit })
        for (const weight of [30, 50, 100, 150, 30]) {
          query = 'weight=' + weight
          assertNutrition(render(unknown), weight)
        }
        assert.equal(unknown.energyUnit, energyUnit)
      }

      // Invalid links follow existing product-variant fallbacks, without displaying nonfinite values.
      for (const invalid of ['', 'weight=garbage', 'weight=NaN', 'weight=Infinity', 'weight=-30', 'weight=0', 'weight=999', 'weight=100.0']) {
        query = invalid
        assertNutrition(render(), 30)
        assertNutrition(render(nutrition, false, { ...product, variant: variants[2] }), 100)
      }

      query = 'weight=50'
      for (const missing of [null, undefined, {},
        { proteins: '', fats: null, carbohydrates: 'bad', energyValue: undefined },
        { proteins: NaN, fats: Infinity, carbohydrates: -1, energyValue: 'invalid' },
      ]) {
        // Passing undefined directly needs explicit props because render() defaults to the fixture.
        const html = missing === undefined
          ? renderToStaticMarkup(React.createElement(NextIntlClientProvider, { locale, messages, timeZone: 'Europe/Kyiv' },
              React.createElement(ProductVariantProvider, { product }, React.createElement(ProductNutrition))))
          : render(missing)
        const cards = sections(html)
        assert.equal(cards.length, 2)
        for (const card of cards) {
          assert.deepEqual(rows(card), Object.fromEntries(labels.map(label => [label, noData])))
        }
        assert.ok(plain(cards[0]).includes(noData), 'missing energy remains missing')
        assert.ok(plain(cards[1]).includes(t['energy-pack-pending']))
        assert.doesNotMatch(html, /NaN|Infinity/)
      }
      assert.equal(JSON.stringify(nutrition), originalNutrition, 'base values and unknown unit must not be mutated')
    }
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
