import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('order confirmation keeps the saved order visible in both languages and gates the Google module', () => {
  // Keep the Google mock isolated from other suites; rendering cannot contact
  // Google, create an order, or send a customer notification.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { NextIntlClientProvider } from 'next-intl'
    import ukMessages from './local/uk.json'
    import enMessages from './local/en.json'

    let surveyOrders = []
    mock.module('@/components/google-customer-reviews', () => ({
      default: ({ order }) => { surveyOrders.push(order); return null },
    }))
    const { default: OrderConfirmation } = await import('./src/components/client/order/order-confirmation.tsx')
    const customerReview = Object.freeze({
      orderId: 'saved-order-42', email: 'buyer@example.test',
      deliveryCountry: 'UA', estimatedDeliveryDate: '2026-11-02',
    })
    const receipt = Object.freeze({
      transactionId: 'saved-order-42', currency: 'UAH', value: 457,
      items: [{ id: 'beef', name: 'Beef', weight: 150, price: 457, quantity: 1 }],
    })
    const response = Object.freeze({
      success: true,
      message: Object.freeze({ uk: 'Замовлення прийнято', en: 'Order received' }),
      receipt, customerReview,
    })
    const original = JSON.stringify(response)

    for (const [locale, messages] of [['uk', ukMessages], ['en', enMessages]]) {
      const render = value => renderToStaticMarkup(React.createElement(
        NextIntlClientProvider,
        { locale, messages, timeZone: 'Europe/Kyiv' },
        React.createElement(OrderConfirmation, { response: value }),
      ))
      surveyOrders = []
      const html = render(response)
      assert.ok(html.includes(messages.order['confirmation-title']), 'confirmation uses the active language')
      assert.ok(html.includes(response.message[locale]), 'server success message remains visible')
      assert.ok(html.includes(messages.order['confirmation-order-number'].replace('{orderId}', receipt.transactionId)), 'saved receipt number is visible')
      assert.ok(html.includes('href="/' + locale + '/products"'), 'customer can continue shopping in the same language')
      assert.ok(html.includes(messages.cart['continue-shopping']))
      assert.match(html, /<section[^>]*aria-labelledby="order-confirmation-title"/)
      assert.match(html, /<h2[^>]*id="order-confirmation-title"[^>]*tabindex="-1"/)
      assert.match(html, /role="status"/)
      assert.ok(!html.includes(customerReview.email), 'customer email is not exposed in visible markup or links')
      assert.equal(surveyOrders.length, 1)
      assert.equal(surveyOrders[0], customerReview, 'survey gets the successful response, not the cleared cart')

      // Optional Google data can be absent without hiding a successful order.
      surveyOrders = []
      const withoutSurvey = render({ success: true, message: {}, receipt })
      assert.ok(withoutSurvey.includes(receipt.transactionId))
      assert.ok(withoutSurvey.includes(messages.order.success), 'missing server translation uses the localized success fallback')
      assert.equal(surveyOrders.length, 0, 'Google is not mounted without review data')
      const withoutReceipt = render({ success: true, message: {} })
      assert.ok(withoutReceipt.includes(messages.order['confirmation-title']))
      assert.ok(!withoutReceipt.includes(receipt.transactionId), 'a missing receipt never produces a fabricated order number')
      assert.equal(surveyOrders.length, 0)
    }
    assert.equal(JSON.stringify(response), original, 'rendering never mutates the successful response')
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
