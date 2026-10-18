import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('blog editor preserves SEO titles and handles image limits and failed requests', () => {
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
    let effects = []
    let effectCursor = 0
    let pendingEffects = []
    let values
    let validations = {}
    let post
    let calls = []
    let editCalls = []
    let notices = []
    let refreshed = 0
    let response = { success: true, message: 'Created' }
    let resolveAction

    const setValue = (name, value) => {
      const keys = name.split('.')
      let target = values
      for (const key of keys.slice(0, -1)) target = target[key] ??= {}
      target[keys.at(-1)] = structuredClone(value)
    }

    mock.module('react', () => ({
      ...React,
      useEffect(effect, dependencies) {
        const index = effectCursor++
        if (!effects[index] || dependencies.some((dependency, i) => !Object.is(dependency, effects[index][i]))) {
          pendingEffects.push(effect)
          effects[index] = dependencies
        }
      },
      useState(initial) {
        const index = cursor++
        if (!(index in state)) state[index] = initial
        return [state[index], (value) => {
          state[index] = typeof value === 'function' ? value(state[index]) : value
        }]
      },
    }))
    mock.module('react-hook-form', () => ({ useForm: ({ defaultValues }) => {
      values ??= structuredClone(defaultValues)
      return {
        register: (name, options = {}) => {
          validations[name] = options
          return { name, onChange: (event) => {
            setValue(name, event.target.value)
            options.onChange?.(event)
          } }
        },
        handleSubmit: (handler) => (data) => handler(structuredClone(data ?? values)),
        setValue,
        formState: { errors: {} },
      }
    } }))
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
      editPostServer: async (...args) => { editCalls.push(args); return response },
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
    const render = () => {
      cursor = 0; effectCursor = 0; pendingEffects = []
      const result = EditorPost({ buttonTitle: post ? 'редагувати' : 'створити', post })
      for (const effect of pendingEffects) effect()
      return result
    }
    const submitButton = () => find(render(), (node) => node.props?.type === 'submit')
    const submit = (data = formData()) => find(render(), (node) => node.type === 'form').props.onSubmit(data)
    const setContent = (content) => find(render(), (node) => node.type === 'quill-editor').props.setContent(content)
    const setLanguage = (value) => find(render(), (node) => node.type === 'RadioGroup').props.onChange({
      target: { value, checked: true },
    })
    const setField = (id, value) => find(render(), (node) => node.props?.id === id).props.onChange({ target: { value } })
    const submitCurrent = () => find(render(), (node) => node.type === 'form').props.onSubmit()
    const setImage = (size, name = 'cover.webp') => {
      find(render(), (node) => node.props?.type === 'file').props.onChange({
        target: { files: [new File([new Uint8Array(size)], name, { type: 'image/webp' })] },
      })
    }
    function reset(existingPost) {
      state = []; calls = []; editCalls = []; notices = []; refreshed = 0
      effects = []; values = undefined; validations = {}; post = existingPost
      response = { success: true, message: 'Created' }
      setContent(english)
      setLanguage('uk')
      setContent(ukrainian)
      setLanguage('en')
      setImage(128)
    }
    const assertReady = () => assert.notEqual(submitButton().props.disabled, true, 'submit must allow another attempt')

    reset()
    assert.deepEqual(values.seoTitle, { en: '', uk: '' }, 'new posts begin with optional blank SEO titles')
    for (const locale of ['en', 'uk']) {
      assert.equal(validations['seoTitle.' + locale].required, undefined)
      assert.equal(validations['seoTitle.' + locale].minLength, undefined)
      assert.equal(validations['seoTitle.' + locale].maxLength.value, 255)
    }
    await submitCurrent()
    assert.deepEqual(calls[0][0].seoTitle, { en: '', uk: '' }, 'blank SEO fields may be submitted')

    reset()
    setField('seo-title-en', 'English search title')
    setField('seo-title-uk', 'Український заголовок для пошуку')
    setLanguage('uk')
    setContent(ukrainian + ' ')
    setLanguage('en')
    setField('slug', 'new-article-slug')
    await submitCurrent()
    assert.deepEqual(calls[0][0].seoTitle, {
      en: 'English search title', uk: 'Український заголовок для пошуку',
    }, 'creation submits each SEO title after content, language and slug changes')

    reset({ ...formData(), _id: 'legacy-post', img: 'https://example.com/cover.webp' })
    assert.deepEqual(values.seoTitle, { en: '', uk: '' }, 'old posts need no SEO field migration in the editor')
    setField('seo-title-uk', 'Новий SEO заголовок')
    setLanguage('uk')
    setContent(ukrainian + ' ')
    setLanguage('en')
    setField('slug', 'legacy-updated')
    await submitCurrent()
    assert.equal(editCalls[0][0], 'legacy-post')
    assert.deepEqual(editCalls[0][1].seoTitle, { en: '', uk: 'Новий SEO заголовок' })

    reset({
      ...formData(), _id: 'seo-post', img: 'https://example.com/cover.webp',
      seoTitle: { en: 'Saved English SEO title', uk: 'Збережений SEO заголовок' },
    })
    assert.deepEqual(values.seoTitle, post.seoTitle, 'editing loads saved SEO titles')
    setField('seo-title-en', '')
    setField('seo-title-uk', 'Оновлений SEO заголовок')
    setField('title-en', 'A changed ordinary English article title')
    setLanguage('uk')
    await submitCurrent()
    assert.deepEqual(editCalls[0][1].seoTitle, { en: '', uk: 'Оновлений SEO заголовок' },
      'editing can clear a saved title and preserve changes through ordinary title and language updates')

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
