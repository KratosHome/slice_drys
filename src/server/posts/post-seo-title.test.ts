import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

function runIsolated(script: string) {
  // Keep module mocks local to this process and never connect to a database.
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
}

test('post schema accepts optional localized SEO titles and preserves trimmed values', () => {
  runIsolated(`
    import assert from 'node:assert/strict'
    import { Post } from './src/server/posts/post-schema.server.ts'

    const postData = {
      title: { en: 'Article title', uk: 'Назва статті' },
      content: { en: 'Content', uk: 'Текст' },
      author: { en: 'Author', uk: 'Автор' },
      metaDescription: { en: 'Description', uk: 'Опис' },
      keywords: { en: 'snacks', uk: 'снеки' },
      slug: 'article',
      img: 'https://example.com/article.webp',
    }

    for (const seoTitle of [undefined, {}, { en: '' }, { uk: '   ' }]) {
      const post = new Post({ ...postData, seoTitle })
      assert.equal(post.validateSync(), undefined)
    }

    const post = new Post({
      ...postData,
      seoTitle: { en: '  English search title  ', uk: '  Назва для пошуку  ' },
    })
    assert.equal(post.validateSync(), undefined)
    assert.deepEqual(post.toObject().seoTitle, {
      en: 'English search title', uk: 'Назва для пошуку',
    })

    for (const locale of ['en', 'uk']) {
      const partial = new Post({ ...postData, seoTitle: { [locale]: 'Search title' } })
      assert.equal(partial.validateSync(), undefined)
      assert.deepEqual(partial.toObject().seoTitle, { [locale]: 'Search title' })

      const tooLong = new Post({ ...postData, seoTitle: { [locale]: 'x'.repeat(256) } })
      assert.ok(tooLong.validateSync()?.errors['seoTitle.' + locale])
    }
  `)
})

test('localized SEO titles reach article metadata with title fallback and unchanged headings', () => {
  runIsolated(`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { Post } from './src/server/posts/post-schema.server.ts'

    let storedPost
    let expectedLocale
    let reads = 0

    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => {},
    }))
    Post.findOne = (filter, projection) => {
      reads += 1
      assert.deepEqual(filter, { slug: 'article' })
      assert.equal(projection['seoTitle.' + expectedLocale], 1)
      assert.equal(projection['title.' + expectedLocale], 1)
      assert.equal(projection['content.' + expectedLocale], 1)
      const otherLocale = expectedLocale === 'en' ? 'uk' : 'en'
      assert.equal(projection['seoTitle.' + otherLocale], undefined)
      return { lean: async () => storedPost }
    }

    const { getPost } = await import('./src/server/posts/get-posts.server.ts')
    mock.module('@/server/public-data-cache.server', () => ({
      getPublicPost: (locale, slug) => getPost({ locale, slug }),
    }))
    mock.module('next/navigation', () => ({
      notFound: () => { throw new Error('Unexpected missing post') },
      permanentRedirect: () => { throw new Error('Unexpected redirect') },
    }))
    for (const component of [
      '@/components/ui/share',
      '@/components/client/json-ld/blog-item-json-ld',
      '@/components/client/promo-banner/join-community',
      '@/components/ui/to-the-top',
    ]) {
      mock.module(component, () => ({ default: () => null }))
    }
    mock.module('quill/dist/quill.snow.css', () => ({}))

    const { generateMetadata, default: PostPage } = await import(
      './src/app/(app)/[locale]/(client)/blog/[slug]/page.tsx'
    )
    const title = { en: 'Article title', uk: 'Назва статті' }
    const content = JSON.stringify({ ops: [{ insert: 'Article content\\n' }] })
    const basePost = {
      title,
      content: { en: content, uk: content },
      author: { en: 'Author', uk: 'Автор' },
      metaDescription: { en: 'Description', uk: 'Опис' },
      keywords: { en: 'snacks', uk: 'снеки' },
      slug: 'article',
      img: 'https://example.com/article.webp',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    const cases = [
      [undefined, title],
      [{}, title],
      [{ en: '', uk: '   ' }, title],
      [{ en: '  English search title  ' }, { en: 'English search title', uk: title.uk }],
      [{ uk: '  Назва для пошуку  ' }, { en: title.en, uk: 'Назва для пошуку' }],
      [{ en: 'English search title', uk: 'Назва для пошуку' },
        { en: 'English search title', uk: 'Назва для пошуку' }],
    ]

    for (const [seoTitle, expectedTitles] of cases) {
      storedPost = { ...basePost, seoTitle }
      for (const locale of ['en', 'uk']) {
        expectedLocale = locale
        const localized = await getPost({ locale, slug: 'article' })
        assert.equal(localized.success, true)
        assert.equal(localized.post[0].seoTitle, seoTitle?.[locale])
        assert.equal(localized.post[0].title, title[locale])

        const metadata = await generateMetadata({
          params: Promise.resolve({ locale, slug: 'ARTICLE' }),
        })
        assert.equal(metadata.title, expectedTitles[locale])
        assert.equal(metadata.openGraph.title, expectedTitles[locale])
        assert.equal(metadata.twitter.title, expectedTitles[locale])
        assert.equal(metadata.openGraph.images[0].alt, title[locale])

        const html = renderToStaticMarkup(await PostPage({
          params: Promise.resolve({ locale, slug: 'article' }),
        }))
        assert.ok(html.includes('>' + title[locale] + '</h1>'))
      }
    }
    assert.equal(reads, cases.length * 2 * 3)
  `)
})
