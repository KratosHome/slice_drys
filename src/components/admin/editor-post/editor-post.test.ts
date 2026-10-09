import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('blog submission handles large images and recovers from failed requests', () => {
  // Keep React and action mocks isolated from the other suites. Exercise the
  // actual editor handlers without a browser, database or image-hosting calls.
  const script = `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import * as React from 'react'
    import { encodeReply } from 'next/dist/compiled/react-server-dom-webpack/client.node.js'
    import nextConfig from './next.config.mjs'
    import { isPostPayloadTooLarge, MAX_POST_PAYLOAD_BYTES } from './src/utils/post-payload.ts'

    let state = []
    let cursor = 0
    let calls = []
    let notices = []
    let refreshed = 0
    let response = { success: true, message: 'Created' }
    let resolveAction

    mock.module('react', () => ({
      ...React,
      useEffect() {},
      useState(initial) {
        const index = cursor++
        if (!(index in state)) state[index] = initial
        return [state[index], (value) => {
          state[index] = typeof value === 'function' ? value(state[index]) : value
        }]
      },
    }))
    mock.module('react-hook-form', () => ({ useForm: () => ({
      register: () => ({}),
      handleSubmit: (handler) => handler,
      setValue() {},
      formState: { errors: {} },
    }) }))
    mock.module('next/navigation', () => ({
      useRouter: () => ({ refresh() { refreshed += 1 } }),
    }))
    mock.module('next/image', () => ({ default: 'img' }))
    mock.module('@/hooks/useToast', () => ({
      useToast: () => ({ toast: (notice) => notices.push(notice) }),
    }))
    mock.module('@/components/admin/quill-editor/d-quill-editor', () => ({ default: 'quill-editor' }))
    mock.module('@/components/ui/spinner', () => ({ default: 'spinner' }))
    for (const [path, exports] of [
      ['button', ['Button']], ['input', ['Input']], ['label', ['Label']],
      ['radio-group', ['RadioGroup', 'RadioGroupItem']],
      ['alert-dialog', ['AlertDialog', 'AlertDialogContent', 'AlertDialogDescription',
        'AlertDialogFooter', 'AlertDialogHeader', 'AlertDialogTitle', 'AlertDialogTrigger']],
    ]) {
      mock.module('@/components/ui/' + path, () => Object.fromEntries(exports.map((name) => [name, name])))
    }
    mock.module('@/utils/convert-to-base-64', () => ({
      convertToBase64: async (file) => {
        if (file.name === 'unreadable.webp') throw new Error('File read failed')
        return 'data:image/webp;base64,' + Buffer.from(await file.arrayBuffer()).toString('base64')
      },
    }))
    mock.module('@/server/posts/create-post.server', () => ({
      createPost: async (...args) => {
        calls.push(args)
        if (response instanceof Error) throw response
        if (response === 'pending') return new Promise((resolve) => { resolveAction = resolve })
        return response
      },
    }))
    mock.module('@/server/posts/edit-post.server', () => ({
      editPostServer: async () => { throw new Error('Unexpected edit') },
    }))
    mock.module('@/server/posts/delete-post.server', () => ({
      deletePost: async () => { throw new Error('Unexpected deletion') },
    }))

    const { default: EditorPost } = await import('./src/components/admin/editor-post/editor-post.tsx')
    const english = JSON.stringify({ ops: [{ insert: 'English article\\n' }] })
    const ukrainian = JSON.stringify({ ops: [{ insert: 'Українська стаття\\n' }] })
    const formData = () => ({
      title: { en: 'An English article title for testing', uk: 'Український заголовок статті для тесту' },
      content: { en: english, uk: ukrainian },
      img: '', slug: 'article-test', author: { en: 'Author', uk: 'Автор' },
      keywords: { en: 'dried fruit', uk: 'сушені фрукти' },
      metaDescription: { en: 'An article description', uk: 'Опис статті' },
    })
    function find(node, predicate) {
      if (!node || typeof node !== 'object') return undefined
      if (Array.isArray(node)) return node.map((child) => find(child, predicate)).find(Boolean)
      if (predicate(node)) return node
      return find(node.props?.children, predicate)
    }
    const render = () => { cursor = 0; return EditorPost({ buttonTitle: 'створити' }) }
    const submitButton = () => find(render(), (node) => node.props?.type === 'submit')
    const submit = (data = formData()) => find(render(), (node) => node.type === 'form').props.onSubmit(data)
    const setContent = (content) => find(render(), (node) => node.type === 'quill-editor').props.setContent(content)
    const setLanguage = (value) => find(render(), (node) => node.type === 'RadioGroup').props.onChange({
      target: { value, checked: true },
    })
    const setImage = (size, name = 'cover.webp') => {
      find(render(), (node) => node.props?.type === 'file').props.onChange({
        target: { files: [new File([new Uint8Array(size)], name, { type: 'image/webp' })] },
      })
    }
    function reset() {
      state = []; calls = []; notices = []; refreshed = 0
      response = { success: true, message: 'Created' }
      setContent(english)
      setLanguage('uk')
      setContent(ukrainian)
      setLanguage('en')
      setImage(128)
    }
    const assertReady = () => assert.notEqual(submitButton().props.disabled, true, 'submit must allow another attempt')

    reset()
    setLanguage('uk')
    setContent('')
    await submit()
    assert.equal(calls.length, 0, 'missing translation must not reach the server')
    assertReady()

    reset()
    setImage(1152 * 1024)
    await submit()
    assert.equal(calls.length, 1, 'an image larger than the former 1 MB request limit must be accepted')
    assert.ok(Buffer.byteLength(JSON.stringify(calls[0])) > 1024 * 1024)
    assert.equal(nextConfig.experimental.serverActions.bodySizeLimit, '4mb')
    assert.ok(Buffer.byteLength(await encodeReply(calls[0])) < 4 * 1024 * 1024)
    assert.equal(refreshed, 1)
    assertReady()

    reset()
    setImage(3 * 1024 * 1024)
    await submit()
    assert.equal(calls.length, 0, 'oversized base64 cover must be stopped before the request')
    assert.ok(notices.some((notice) => notice.variant === 'destructive'))
    assertReady()

    reset()
    setContent(JSON.stringify({ ops: [{ insert: { image: 'data:image/webp;base64,' + 'A'.repeat(4 * 1024 * 1024) } }] }))
    await submit()
    assert.equal(calls.length, 0, 'inline editor images count toward the request limit')
    assertReady()

    const unicodeBoundary = ['ї'.repeat((MAX_POST_PAYLOAD_BYTES - 4) / 2)]
    assert.equal(isPostPayloadTooLarge(unicodeBoundary), false, 'allow payload at the UTF-8 byte budget')
    assert.ok(Buffer.byteLength(await encodeReply(unicodeBoundary)) < 4 * 1024 * 1024)
    assert.equal(isPostPayloadTooLarge([unicodeBoundary[0] + 'ї']), true, 'count UTF-8 bytes, not characters')

    reset()
    response = new Error('HTTP 500')
    await submit()
    assert.equal(calls.length, 1)
    assert.ok(notices.some((notice) => notice.variant === 'destructive'))
    assert.equal(refreshed, 0, 'failed submission must preserve the current form')
    assertReady()
    response = { success: true, message: 'Created' }
    await submit()
    assert.equal(calls.length, 2, 'retry must reach the action')
    assert.equal(refreshed, 1)
    assertReady()

    reset()
    setImage(128, 'unreadable.webp')
    await submit()
    assert.equal(calls.length, 0, 'a file read error must not reach the server')
    assert.ok(notices.some((notice) => notice.variant === 'destructive'))
    assertReady()

    reset()
    response = 'pending'
    const pending = submit()
    for (let attempt = 0; !resolveAction && attempt < 10; attempt++) {
      await new Promise((resolve) => setImmediate(resolve))
    }
    assert.equal(submitButton().props.disabled, true, 'disable repeat clicks while saving')
    await submit()
    assert.equal(calls.length, 1, 'a repeat submission must not duplicate the request')
    resolveAction({ success: true, message: 'Created' })
    await pending
    assertReady()
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
