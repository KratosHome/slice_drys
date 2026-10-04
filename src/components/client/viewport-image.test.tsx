import assert from 'node:assert/strict'
import { test } from 'node:test'
import { NextIntlClientProvider } from 'next-intl'
import { renderToStaticMarkup } from 'react-dom/server'

import messages from '../../../local/uk.json'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import BlogSection from './main/blog/blog'
import InstaFeedSection from './main/insta-feed/Insta-feed'
import ViewportImage from './viewport-image'

function withoutNoScript(html: string) {
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
}

test('deferred images expose responsive sources only in the no-JavaScript fallback', () => {
  const html = renderToStaticMarkup(
    <ViewportImage
      enabled={false}
      src="/regression.webp"
      alt="Fruit & herbs"
      fill
      sizes="(max-width: 767px) 100vw, 400px"
      className="object-cover"
    />,
  )

  assert.equal(withoutNoScript(html), '')
  assert.match(html, /^<noscript><img\b/)
  assert.match(html, /alt="Fruit &amp; herbs"/)
  assert.match(html, /loading="lazy"/)
  assert.match(html, /srcSet="[^"]*\/_next\/image\?url=/)
  assert.match(html, /sizes="\(max-width: 767px\) 100vw, 400px"/)
  assert.match(html, /style="position:absolute;height:100%;width:100%/)
  assert.doesNotMatch(html, /<link\b/)
})

test('activation preserves reserved geometry and the same optimized image', () => {
  const render = (enabled: boolean) =>
    renderToStaticMarkup(
      <AspectRatio ratio={355 / 285} className="h-full">
        <ViewportImage
          enabled={enabled}
          src="/regression.webp"
          alt="Post title"
          fill
          sizes="400px"
          fetchPriority="low"
        />
      </AspectRatio>,
    )
  const deferred = render(false)
  const active = render(true)
  const frame = (html: string) =>
    html.match(/<div[^>]*data-slot="aspect-ratio-wrapper"[^>]*>/)?.[0]
  assert.equal(frame(active), frame(deferred))
  assert.doesNotMatch(withoutNoScript(deferred), /<img\b/)

  const visibleImage = withoutNoScript(active).match(/<img\b[^>]*>/)?.[0]
  assert.ok(visibleImage)
  assert.match(visibleImage, /loading="eager"/)
  assert.match(visibleImage, /fetchPriority="low"/)
  const fallbackImage = active.match(/<noscript>(<img\b[^>]*>)/)?.[1]
  assert.ok(fallbackImage)
  const source = (img: string) => img.match(/\ssrc="([^"]*)"/)?.[1]
  assert.equal(source(visibleImage), source(fallbackImage))
})

test('blog and Instagram retain SSR content, navigation and image slots before activation', () => {
  const blogPost: IPost = {
    _id: 'fixture',
    title: 'Fixture blog post',
    content: 'Post content',
    img: '/blog-fixture.webp',
    author: 'Slice Drys',
    slug: 'fixture-blog',
    metaDescription: 'Fixture description',
    keywords: 'fixture',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
  }
  const instaPost: InstaFeed = {
    id: 'fixture',
    caption: 'Fixture Instagram caption',
    media_type: 'IMAGE' as InstaSimplePost['media_type'],
    media_url: '/insta-fixture.webp',
    permalink: 'https://www.instagram.com/p/fixture/',
  }
  const html = renderToStaticMarkup(
    <NextIntlClientProvider
      locale="uk"
      messages={messages}
      timeZone="Europe/Kyiv"
    >
      <BlogSection data={[blogPost]} />
      <InstaFeedSection data={[instaPost]} title="Instagram stories" />
    </NextIntlClientProvider>,
  )
  const ordinaryMarkup = withoutNoScript(html)

  assert.doesNotMatch(ordinaryMarkup, /<img\b|<link[^>]*rel="preload"/)
  assert.match(ordinaryMarkup, /href="\/uk\/blog\/fixture-blog"/)
  assert.match(ordinaryMarkup, /<h3[^>]*>Fixture blog post<\/h3>/)
  assert.match(ordinaryMarkup, /href="https:\/\/www.instagram.com\/p\/fixture\/"/)
  assert.match(ordinaryMarkup, /Fixture Instagram caption/)
  const reservedHeight = parseFloat(
    ordinaryMarkup.match(/padding-bottom:([\d.]+)%/)?.[1] ?? 'NaN',
  )
  assert.ok(Math.abs(reservedHeight - (100 * 285) / 355) < 1e-10)
  assert.match(ordinaryMarkup, /class="relative aspect-square w-full"/)
  assert.equal((html.match(/<noscript><img\b/g) ?? []).length, 2)
})
