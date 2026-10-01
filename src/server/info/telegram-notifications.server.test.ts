import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('Telegram notifications send once, never poll, and preserve failure responses', () => {
  // Keep the real Telegram client while replacing its HTTP transport. Run in a
  // separate process to isolate fetch, environment variables, and server mocks.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'

    mock.module('server-only', () => ({}))
    process.env.TELEGRAM_BOT_TOKEN = '123456:test-token'
    process.env.TELEGRAM_BOT_CHAT_ID = '-100123456789'

    const requests = []
    const loggedErrors = []
    let responseMode = 'success'
    console.error = (...args) => { loggedErrors.push(args) }
    globalThis.fetch = async (input, init) => {
      const request = new Request(input, init)
      const form = await request.formData()
      assert.equal(request.method, 'POST')
      assert.equal(request.url, 'https://api.telegram.org/bot123456:test-token/sendMessage')
      requests.push({ chatId: form.get('chat_id'), text: form.get('text') })

      if (responseMode === 'network-error') throw new TypeError('Mock connection failure')
      if (responseMode === 'rate-limit') {
        return Response.json({
          ok: false, error_code: 429, description: 'Too Many Requests',
          parameters: { retry_after: 1 },
        }, { status: 429 })
      }
      return Response.json({
        ok: true,
        result: { message_id: 1, date: 0, chat: { id: -100123456789, type: 'group' }, text: 'sent' },
      })
    }

    const { callMeBackServer } = await import('./src/server/info/call-me-back.server.ts')
    const { sendReviews } = await import('./src/server/info/send-reviews.server.ts')
    const { sendWholesale } = await import('./src/server/info/wholesale.server.ts')
    const { sendOrderNotification } = await import('./src/server/info/order-notification.server.ts')
    const cases = [
      {
        send: () => callMeBackServer({ name: 'Callback name', phoneNumber: '0631234567' }),
        expectedText: ['Callback name', '0631234567'],
        success: { success: true, message: 'Повідомлення відправлено' },
      },
      {
        send: () => sendReviews({ name: '  Review name  ', text: '  Review content  ' }),
        expectedText: ['Review name', 'Review content'],
        success: { success: true, message: 'Відгук відправлений' },
      },
      {
        send: () => sendWholesale({
          name: 'Wholesale name', phoneNumber: '0631234567', email: 'test@example.test',
          whereSell: 'Test shop', link: 'example.test',
        }),
        expectedText: ['Wholesale name', 'Test shop', 'не вказано'],
        success: { success: true },
      },
      {
        send: () => sendOrderNotification({
          totalPrice: '457', paymentMethod: 'cash', name: 'Buyer name', phone: '0631234567',
          delivery: 'Test branch', comment: 'Test comment', products: 'Beef 150g', callback: 'Yes',
          blogger: { name: 'Blogger name', interest: 10, link: 'example.test/blogger', commissionAmount: 45.7 },
        }),
        expectedText: ['Buyer name', 'Beef 150g', 'Blogger name', '45.7'],
        success: undefined,
      },
    ]

    for (const entry of cases) {
      for (const mode of ['success', 'network-error', 'rate-limit']) {
        responseMode = mode
        const countBefore = requests.length
        const errorsBefore = loggedErrors.length
        const result = await entry.send()
        assert.equal(requests.length, countBefore + 1, 'One HTTP request per notification; no polling or retries')
        const request = requests.at(-1)
        assert.equal(request.chatId, '-100123456789')
        for (const text of entry.expectedText) assert.ok(request.text.includes(text))

        if (mode === 'success') {
          assert.deepEqual(result, entry.success)
        } else if (entry.success === undefined) {
          assert.equal(result, undefined)
          assert.equal(loggedErrors.length, errorsBefore + 1)
          assert.equal(loggedErrors.at(-1)[0], 'Order notification failed')
        } else {
          assert.equal(result.success, false)
          assert.equal(typeof result.message, 'string')
          assert.ok(result.message.length > 0)
        }
      }
    }

    const countBefore = requests.length
    assert.deepEqual(await sendReviews({ name: '', text: 'Review' }), {
      success: false, message: 'Не вдалося відправити відгук',
    })
    delete process.env.TELEGRAM_BOT_TOKEN
    assert.deepEqual(await sendReviews({ name: 'Reviewer', text: 'Review' }), {
      success: false, message: 'Не вдалося відправити відгук',
    })
    assert.equal(requests.length, countBefore, 'Rejected reviews must not make HTTP requests')
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
