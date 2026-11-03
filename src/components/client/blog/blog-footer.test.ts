import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('newsletter signups count only a confirmed new subscription across overlapping submits, remounts and lost replies', () => {
  // Run the real form and action together with an in-memory collection and a
  // controllable transport. Isolate these mocks from other Bun test files.
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import * as React from 'react'
    const addresses = new Set(['Legacy@Example.test'])
    let writeMode, gate, calls = 0, writes = 0
    mock.module('@/server/connect-to-db.server', () => ({ connectToDbServer: async () => {} }))
    mock.module('@/server/subscribe/subscription-schema.server', () => ({
      Subscription: {
        collection: { createIndex: async (keys, options) => {
          assert.deepEqual(keys, { email: 1 })
          assert.equal(options.unique, true)
        } },
        async updateOne(filter, update, options) {
          writes++
          assert.equal(options.upsert, true)
          const email = update.$setOnInsert.email
          assert.equal(filter.email, email)
          assert.equal(email, email.trim().toLowerCase())
          if (gate) await gate.promise
          if (writeMode === 'error') throw new Error('private database details')
          if (writeMode === 'duplicate') throw Object.assign(new Error('duplicate'), { code: 11000, keyValue: { email } })
          if (writeMode === 'unacknowledged') return { acknowledged: false }
          const exists = [...addresses].some((address) =>
            options.collation.strength === 2 ? address.toLowerCase() === email : address === email)
          if (!exists) addresses.add(email)
          return { acknowledged: true, upsertedCount: exists ? 0 : 1, matchedCount: exists ? 1 : 0 }
        },
      },
    }))
    const { subscribeServer: subscribe } = await import('./src/server/subscribe/subscribe.server.ts')
    const invalid = await subscribe('bad address')
    assert.equal(invalid.success, false)
    assert.equal(invalid.created, false)
    assert.equal(writes, 0)
    const legacy = await subscribe('  LEGACY@example.test ')
    assert.equal(legacy.success, true)
    assert.equal(legacy.created, false)
    assert.equal(addresses.size, 1)
    for (writeMode of ['error', 'unacknowledged', 'duplicate']) {
      const result = await subscribe('safe@example.test')
      assert.equal(result.success, writeMode === 'duplicate')
      assert.equal(result.created, false)
      assert.doesNotMatch(JSON.stringify(result), /private database details|safe@example/)
    }
    writeMode = undefined

    let loseReply = false
    mock.module('@/server/subscribe/subscribe.server', () => ({
      subscribeServer: async (email) => {
        calls++
        const response = await subscribe(email)
        if (loseReply) throw new Error('reply lost')
        return response
      },
    }))
    const notices = [], signups = []
    const hooks = { useRef: (initial) => ({ current: initial }), useState: (initial) => [initial, () => {}] }
    mock.module('react', () => ({ ...React, ...hooks, default: { ...React.default, ...hooks } }))
    mock.module('next-intl', () => ({ useLocale: () => 'en', useTranslations: () => (key) => key }))
    mock.module('next/image', () => ({ default: 'img' }))
    mock.module('@/hooks/useToast', () => ({ useToast: () => ({ toast: (notice) => notices.push(notice) }) }))
    mock.module('@/utils/analytics', () => ({ trackNewsletterSignup: (...args) => signups.push(args) }))
    for (const [path, key] of [['aspect-ratio', 'AspectRatio'], ['input', 'Input'], ['button', 'Button'],
                               ['spinner-btn', 'default'], ['underline-wave', 'default']]) {
      mock.module('@/components/ui/' + path, () => ({ [key]: 'stub' }))
    }
    globalThis.FormData = class extends FormData {
      constructor(form) { super(); this.set('email', form.email) }
    }
    const { default: BlogFooter } = await import('./src/components/client/blog/blog-footer.tsx')
    function findForm(node) {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) return node.map(findForm).find(Boolean)
      return node.type === 'form' ? node : findForm(node.props?.children)
    }
    function mount() {
      const form = findForm(BlogFooter())
      let resets = 0
      return {
        submit: (email) => form.props.onSubmit({
          preventDefault() {}, currentTarget: { email, reset() { resets++ } },
        }),
        resets: () => resets,
      }
    }
    const footer = mount()
    assert.equal(calls, 0)
    gate = Promise.withResolvers()
    const first = footer.submit(' New@Example.Test ')
    const doubleClick = footer.submit(' New@Example.Test ')
    assert.equal(calls, 1, 'two immediate submits of one form share one request')
    const reopened = mount()
    assert.equal(signups.length, 0, 'opening a form must not count a signup')
    const concurrent = reopened.submit('new@example.test')
    assert.equal(calls, 2)
    assert.deepEqual(signups, [], 'nothing is counted while the write is pending')
    gate.resolve()
    await Promise.all([first, doubleClick, concurrent])
    gate = undefined
    assert.ok(addresses.has('new@example.test'))
    assert.deepEqual(signups, [[]], 'exactly the winning insert emits, without an email argument')
    assert.equal(footer.resets(), 1)
    assert.equal(reopened.resets(), 1)
    await reopened.submit('NEW@example.test')
    assert.deepEqual(signups, [[]])

    writeMode = 'error'
    await reopened.submit('retry@example.test')
    assert.equal(notices.at(-1).variant, 'destructive')
    assert.equal(reopened.resets(), 2)
    writeMode = undefined
    loseReply = true
    await reopened.submit('lost@example.test')
    assert.ok(addresses.has('lost@example.test'), 'the insert committed before loss of the reply')
    assert.equal(notices.at(-1).variant, 'destructive')
    assert.equal(reopened.resets(), 2, 'an uncertain result leaves the input available for retry')
    loseReply = false
    await mount().submit(' LOST@example.test ')
    assert.deepEqual(signups, [[]], 'neither a lost confirmation nor its already-subscribed retry emits')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
