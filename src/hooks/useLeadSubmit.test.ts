import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('callback and wholesale forms only confirm and count successful submissions', () => {
  // Exercise the actual form handlers. Keep action and React mocks local to
  // this process and send no notifications or analytics requests.
  const script = `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import * as React from 'react'

    let refs = [], cursor = 0, resets = 0, notices = [], leads = [], calls = [], openings = []
    let respond
    mock.module('react', () => ({
      ...React, useId: () => 'test-id',
      useRef: (initial) => refs[cursor++] ??= { current: initial },
    }))
    mock.module('react-hook-form', () => ({
      Controller: 'controller', useForm: () => ({
        register: () => ({}), control: {}, formState: { errors: {} },
        handleSubmit: (fn) => fn, reset: () => resets++,
      }),
    }))
    mock.module('next-intl', () => ({ useTranslations: () => (key) => key }))
    mock.module('next/image', () => ({ default: 'img' }))
    mock.module('@/components/ui/forwarded-masked-input', () => ({ default: 'input' }))
    for (const [path, exports] of [
      ['dialog', ['Dialog','AnimatedDialogContent','DialogDescription','DialogHeader','DialogTitle']],
      ['button', ['Button']], ['input', ['Input']], ['label', ['Label']],
    ]) mock.module('@/components/ui/' + path, () => Object.fromEntries(exports.map(key => [key, key])))
    mock.module('@/hooks/useToast', () => ({ toast: (notice) => notices.push(notice) }))
    mock.module('@/utils/analytics', () => ({ trackLead: (...args) => leads.push(args) }))
    function action(kind, data) {
      calls.push([kind, data])
      return respond()
    }
    mock.module('@/server/info/call-me-back.server', () => ({ callMeBackServer: (data) => action('callback', data) }))
    mock.module('@/server/info/wholesale.server', () => ({ sendWholesale: (data) => action('wholesale', data) }))
    const { default: Contact } = await import('./src/components/client/contacts/contact-form.tsx')
    const { default: Dialog } = await import('./src/components/client/header/call-me-dialog.tsx')
    const { default: Wholesale } = await import('./src/components/client/wholesale/wholesale-form.tsx')
    function findForm(node) {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) return node.map(findForm).find(Boolean)
      if (node.type === 'form') return node
      return findForm(node.props?.children)
    }

    for (const [component, kind] of [[Contact, 'callback'], [Dialog, 'callback'], [Wholesale, 'wholesale']]) {
      refs = []; resets = 0; notices = []; leads = []; calls = []; openings = []
      const render = (open = true) => {
        cursor = 0
        return component({ id: 'test', open, onOpenChange: (value) => openings.push(value), triggerRef: { current: null } })
      }
      const data = { name: 'Customer', phoneNumber: '+38 (063) 123-4567', email: 'test@example.test' }
      const submit = () => findForm(render()).props.onSubmit(data)
      render(false); render()
      assert.equal(leads.length, 0)
      assert.equal(calls.length, 0)

      for (const failure of [() => Promise.resolve({ success: false }),
        () => Promise.reject(new Error('lost response')), () => { throw new Error('action unavailable') }]) {
        respond = failure
        await submit()
        assert.equal(leads.length, 0)
        assert.equal(resets, 0)
        assert.equal(openings.length, 0)
        assert.equal(notices.at(-1).variant, 'destructive')
      }
      let resolve
      respond = () => new Promise((accept) => { resolve = accept })
      const first = submit(), duplicate = submit()
      assert.equal(calls.length, 4)
      assert.equal(leads.length, 0)
      resolve({ success: true })
      await Promise.all([first, duplicate])
      assert.deepEqual(leads, [[kind]], 'analytics receives only a form type')
      assert.equal(resets, 1)
      if (component === Dialog) assert.deepEqual(openings, [false])
      else assert.equal(notices.at(-1).variant, undefined)
      render(false); render()
      assert.equal(leads.length, 1)

      if (component === Dialog) {
        const inFlight = submit()
        render().props.onOpenChange(false)
        render(false); render()
        resolve({ success: true })
        await inFlight
        assert.equal(leads.length, 2)
        assert.equal(resets, 1, 'late response preserves the reopened form')
        assert.deepEqual(openings, [false, false])
      }
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
