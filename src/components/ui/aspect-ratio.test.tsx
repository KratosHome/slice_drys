import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import Image from 'next/image'
import { renderToStaticMarkup } from 'react-dom/server'

import { AspectRatio } from './aspect-ratio'

function elementWithSlot(html: string, slot: string) {
  const tag = html.match(new RegExp(`<div[^>]*data-slot="${slot}"[^>]*>`))?.[0]
  assert.ok(tag, `missing ${slot} element`)
  const style = Object.fromEntries(
    (tag.match(/style="([^"]*)"/)?.[1] ?? '')
      .split(';')
      .filter(Boolean)
      .map((declaration) => declaration.split(':')),
  )
  return { tag, style }
}

describe('aspect ratio image layout', () => {
  test('sizes the outer wrapper proportionally for every consumer ratio', () => {
    for (const ratio of [593 / 475, 355 / 285, 484 / 433, 1.42, 1.32]) {
      const html = renderToStaticMarkup(<AspectRatio ratio={ratio} />)
      const { style } = elementWithSlot(html, 'aspect-ratio-wrapper')

      assert.equal(style.position, 'relative')
      assert.equal(style.width, '100%')
      assert.equal(style['padding-bottom'], `${100 / ratio}%`)
      assert.equal(style.height, undefined)
    }

    const html = renderToStaticMarkup(<AspectRatio />)
    assert.equal(
      elementWithSlot(html, 'aspect-ratio-wrapper').style['padding-bottom'],
      '100%',
    )
  })

  test('keeps h-full and caller styles on the positioned content frame', () => {
    const html = renderToStaticMarkup(
      <AspectRatio
        ratio={355 / 285}
        className="h-full overflow-hidden"
        id="blog-image"
        style={{ height: '100%', borderRadius: 12, position: 'relative' }}
      >
        <Image
          src="/regression.webp"
          alt="Blog image"
          loading="lazy"
          fill
          sizes="100vw"
        />
        <span>Image content</span>
      </AspectRatio>,
    )
    const wrapper = elementWithSlot(html, 'aspect-ratio-wrapper')
    const frame = elementWithSlot(html, 'aspect-ratio')

    assert.doesNotMatch(wrapper.tag, /class=|id=/)
    assert.equal(wrapper.style.height, undefined)
    assert.ok(
      Math.abs(parseFloat(wrapper.style['padding-bottom']) - (100 * 285) / 355) <
        1e-10,
    )
    assert.match(frame.tag, /class="h-full overflow-hidden"/)
    assert.match(frame.tag, /id="blog-image"/)
    assert.equal(frame.style.height, '100%')
    assert.equal(frame.style['border-radius'], '12px')
    assert.equal(frame.style.position, 'absolute')
    for (const edge of ['top', 'right', 'bottom', 'left']) {
      assert.equal(frame.style[edge], '0')
    }

    const content = html.match(
      /<div[^>]*data-slot="aspect-ratio"[^>]*>(.*?)<\/div>/,
    )?.[1]
    assert.ok(content)
    assert.match(content, /<img[^>]*alt="Blog image"[^>]*>/)
    assert.match(content, /data-nimg="fill"/)
    assert.match(content, /<span>Image content<\/span>/)
  })
})
