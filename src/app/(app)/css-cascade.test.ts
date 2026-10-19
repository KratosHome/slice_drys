import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { test } from 'node:test'
import { gzipSync } from 'node:zlib'
import postcss, { type AnyNode, type Root } from 'postcss'
import config from '../../../postcss.config.mjs'

async function compile(filename: string) {
  const from = path.resolve('src/app/(app)', filename)
  const plugins = await Promise.all(
    Object.entries(config.plugins).map(async ([name, options]) => {
      const { default: createPlugin } = await import(name)
      return createPlugin(options)
    }),
  )
  const result = await postcss(plugins).process(await readFile(from, 'utf8'), {
    from,
  })
  return { css: result.css, root: postcss.parse(result.css) }
}

// This oracle is deliberately limited to the two single-class flex-direction
// rules in the regression fixture. Browser navigation checks cover full CSS.
function flexDirection(stylesheets: Root[], width: number) {
  const layers = new Map<string, number>()
  const register = (name: string) => {
    if (!layers.has(name)) layers.set(name, layers.size)
  }
  const candidates: {
    value: string
    important: boolean
    priority: number
    order: number
  }[] = []
  let order = 0
  for (const root of stylesheets) {
    root.walkAtRules('layer', (layer) => {
      layer.params.split(',').forEach((name) => register(name.trim()))
    })
    root.walkRules((rule) => {
      order++
      if (
        !rule.selector
          .split(',')
          .some((selector) =>
            ['.flex-col', '.lg\\:flex-row'].includes(selector.trim()),
          )
      )
        return
      let layerName: string | undefined
      for (
        let parent: AnyNode | undefined = rule.parent;
        parent;
        parent = parent.parent
      ) {
        if (parent.type !== 'atrule') continue
        if (parent.name === 'layer') layerName = parent.params
        if (parent.name === 'media') {
          const minimum = parent.params.match(
            /(?:width\s*>=\s*|min-width\s*:\s*)([\d.]+)(rem|px)/,
          )
          assert.ok(
            minimum,
            `Unhandled fixture media condition: ${parent.params}`,
          )
          if (width < Number(minimum[1]) * (minimum[2] === 'rem' ? 16 : 1))
            return
        }
      }
      assert.ok(layerName, 'Tailwind fixture rules must be layered')
      const priority = layers.get(layerName)
      assert.notEqual(priority, undefined)
      rule.walkDecls('flex-direction', (declaration) => {
        candidates.push({
          value: declaration.value,
          important: !!declaration.important,
          priority: declaration.important ? -priority! : priority!,
          order,
        })
      })
    })
  }
  candidates.sort(
    (a, b) =>
      Number(a.important) - Number(b.important) ||
      a.priority - b.priority ||
      a.order - b.order,
  )
  return candidates.at(-1)?.value
}

test('compiled route utilities preserve responsive layout when homepage CSS is retained last', async () => {
  const [homepage, storefront] = await Promise.all([
    compile('homepage-utilities.css'),
    compile('storefront-pages.css'),
  ])
  for (const order of [
    [homepage.root, storefront.root],
    [storefront.root, homepage.root],
  ]) {
    assert.equal(flexDirection(order, 1441), 'row')
    assert.equal(flexDirection(order, 1024), 'row')
    assert.equal(flexDirection(order, 1023), 'column')
    assert.equal(flexDirection(order, 320), 'column')
  }

  const homepageBytes = gzipSync(homepage.css).length
  assert.ok(
    homepageBytes < 16_000,
    `Homepage utilities grew to ${homepageBytes} gzip bytes`,
  )
  assert.ok(
    homepageBytes < gzipSync(storefront.css).length * 0.8,
    'Homepage must retain a smaller source scope than the full storefront',
  )
})
