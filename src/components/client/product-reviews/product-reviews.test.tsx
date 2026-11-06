import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('product reviews SSR shows an always-visible localized form, real ratings and only one reply level', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { ProductReviews } from './src/components/client/product-reviews/index.tsx'
    import { ReviewForm } from './src/components/client/product-reviews/review-form.tsx'

    const render = (component, props) => renderToStaticMarkup(React.createElement(component, props))
    const reviews = [{
      id: 'review-1', author: 'Olena', text: 'Смачні <script>alert(1)</script>',
      rating: 4, createdAt: '2026-11-06T12:00:00.000Z', isStoreRepresentative: false,
      photos: [{ publicId: 'safe-photo', url: '/api/product-review-photos/review-1/0' }],
      replies: [{ id: 'reply-1', author: 'SliceDrys', text: 'Дякуємо за відгук!',
        createdAt: '2026-11-06T13:00:00.000Z', isStoreRepresentative: true }],
    }]
    const data = { productId: 'product-1', ratingCount: 1, averageRating: 4, reviews }
    const initial = JSON.stringify(data)
    for (const locale of ['uk', 'en']) {
      const empty = render(ProductReviews, { locale, data: { ...data, reviews: [], ratingCount: 0, averageRating: null } })
      assert.ok(empty.includes(locale === 'uk' ? 'Ще немає відгуків' : 'No reviews yet'))
      assert.equal((empty.match(/<form\b/g) || []).length, 1, 'the review form is visible on initial render')
      assert.equal((empty.match(/type="radio"/g) || []).length, 5, 'empty stars belong only to the rating selector')
      assert.doesNotMatch(empty, /role="img"|checked=""|\/ 5/, 'an empty product has no published or preselected rating')
      const emptyButtons = [...empty.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map(([button]) => button)
      for (const text of [locale === 'uk' ? 'Залишити відгук' : 'Leave a review', locale === 'uk' ? 'Скасувати' : 'Cancel']) {
        assert.ok(emptyButtons.every(button => !button.includes(text)), 'the main form has no open/cancel toggle')
      }

      const html = render(ProductReviews, { locale, data })
      assert.equal((html.match(/<form\b/g) || []).length, 1, 'the main form stays visible when approved reviews exist')
      assert.ok(html.includes('Olena'))
      assert.ok(html.includes('Дякуємо за відгук!'), 'approved replies are server rendered for the same product')
      assert.ok(html.includes(locale === 'uk' ? 'Представник магазину' : 'Store representative'))
      assert.ok(html.includes('dateTime="2026-11-06T12:00:00.000Z"'))
      assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
      assert.doesNotMatch(html, /<script>/, 'review text is escaped, never HTML')
      assert.match(html, /src="\/api\/product-review-photos\/review-1\/0"/, 'photo URLs bypass the Next optimizer so moderation remains enforceable')
      const replyButtons = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].filter(([button]) => button.includes(locale === 'uk' ? '>Відповісти<' : '>Reply<'))
      assert.equal(replyButtons.length, 1, 'only the root review has a reply action')
      assert.equal((html.match(/role="img"/g) || []).length, 2, 'aggregate and root review ratings exclude the reply')

      const rootForm = render(ReviewForm, { locale, productId: 'product-1' })
      assert.equal((rootForm.match(/type="radio"/g) || []).length, 5)
      assert.doesNotMatch(rootForm, /checked=""/, 'the customer must choose a rating')
      assert.match(rootForm, /name="text"[^>]*required=""[^>]*maxLength="2000"/)
      assert.match(rootForm, /accept="image\/jpeg,image\/png,image\/webp,image\/heic,image\/heif,\.heic,\.heif"/)
      assert.ok(rootForm.includes(locale === 'uk' ? '20 МіБ' : '20 MiB'))
      assert.match(rootForm, /name="author"/)
      const uploadButton = [...rootForm.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].find(([button]) => button.includes(locale === 'uk' ? 'Додати фото' : 'Add photos'))?.[0]
      assert.ok(uploadButton, 'the photo picker has a site-localized button')
      assert.match(uploadButton, /type="button"/, 'choosing photos never submits the form')
      const nativePicker = rootForm.match(/<input\b[^>]*type="file"[^>]*>/)?.[0]
      assert.ok(nativePicker)
      assert.match(nativePicker, /hidden=""/, 'browser-localized native file controls stay hidden')
      const replyForm = render(ReviewForm, { locale, productId: 'product-1', parentId: 'review-1' })
      assert.doesNotMatch(replyForm, /type="radio"|type="file"/, 'replies cannot submit ratings or photos')
      assert.match(replyForm, /name="text"[^>]*required=""/)
    }
    assert.equal(JSON.stringify(data), initial)
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
