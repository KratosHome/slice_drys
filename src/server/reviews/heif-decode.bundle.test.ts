import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)
const projectRoot = fileURLToPath(new URL('../../../', import.meta.url))

test('decodes HEIC in Node after bundling with the Next.js webpack compiler', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'review-heif-bundle-'))
  try {
    const loader = join(directory, 'typescript-loader.cjs')
    const runner = join(directory, 'run.cjs')
    await writeFile(
      loader,
      `const ts = require(${JSON.stringify(require.resolve('typescript'))})
module.exports = function (source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText
}
`,
    )
    // Source-only tests miss webpack replacing require.resolve() with a numeric
    // module ID. Compile the actual decoder, then run its worker in real Node.
    await writeFile(
      runner,
      `const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { webpack } = require(${JSON.stringify(require.resolve('next/dist/compiled/webpack/webpack'))})
const compiler = webpack({
  mode: 'production',
  target: 'node',
  entry: ${JSON.stringify(join(projectRoot, 'src/server/reviews/heif-decode.server.ts'))},
  output: { path: __dirname, filename: 'decoder.cjs', library: { type: 'commonjs2' } },
  optimization: { minimize: false },
  resolve: { extensions: ['.ts', '.js'], alias: { '@': ${JSON.stringify(join(projectRoot, 'src'))} } },
  module: { rules: [{ test: /\\.ts$/, use: ${JSON.stringify(loader)} }] }
})
compiler.run((error, stats) => {
  compiler.close(async closeError => {
    try {
      if (error || closeError) throw error || closeError
      if (stats.hasErrors()) throw new Error(stats.toString({ all: false, errors: true }))
      const { decodeHeifPhoto } = require(path.join(__dirname, 'decoder.cjs'))
      const image = await decodeHeifPhoto(fs.readFileSync(${JSON.stringify(join(projectRoot, 'src/server/reviews/__fixtures__/example.heic'))}))
      assert.equal(image.width, 1280)
      assert.equal(image.height, 854)
      assert.equal(image.data.byteLength, 1280 * 854 * 4)
      assert.ok(image.data.some(value => value !== 0))
      process.stdout.write('HEIC bundle decoded successfully')
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }
  })
})
`,
    )
    const { stdout } = await execFileAsync('node', [runner], {
      cwd: projectRoot,
      timeout: 60_000,
    })
    assert.equal(stdout, 'HEIC bundle decoded successfully')
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
