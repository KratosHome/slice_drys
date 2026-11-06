import { Worker } from 'node:worker_threads'
import { REVIEW_MAX_PHOTO_PIXELS } from '@/constants/product-review'

const DECODE_TIMEOUT_MS = 20_000

// The installed heic-to package contains libheif 1.23.7. Its browser worker
// wrapper is adapted inside a disposable Node worker; only trusted package
// JavaScript is evaluated. Uploaded bytes are passed solely to the decoder.
const WORKER_SOURCE = String.raw`
const { parentPort, workerData } = require('node:worker_threads')
const { pathToFileURL } = require('node:url')
const vm = require('node:vm')
// Resolve with Node inside the worker. Bundlers rewrite an outer
// require.resolve() to a numeric module ID, which is not a filesystem path.
const modulePath = require.resolve('heic-to/csp')
globalThis.require = require
globalThis.__dirname = require('node:path').dirname(modulePath)
globalThis.self = globalThis
globalThis.onmessage = null
// Decoder diagnostics may contain untrusted container strings. Return only a
// generic failure to the parent and keep those diagnostics out of server logs.
console.log = () => {}
console.error = () => {}
globalThis.ImageData = class ImageData {
  constructor(width, height) {
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 || width * height > workerData.maxPixels) {
      throw new Error('Decoded image exceeds the pixel limit')
    }
    this.width = width
    this.height = height
    this.data = new Uint8ClampedArray(width * height * 4)
  }
}
globalThis.createImageBitmap = async image => image
globalThis.Worker = class WorkerAdapter {
  constructor(url) {
    this.listeners = new Map()
    this.ready = fetch(url).then(response => response.text()).then(source => {
      URL.revokeObjectURL(url)
      globalThis.postMessage = data => this.emit('message', { data, currentTarget: this })
      vm.runInThisContext(source, { filename: 'heic-to-decoder.js' })
    })
  }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type).add(listener)
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener) }
  emit(type, event) { for (const listener of this.listeners.get(type) ?? []) listener(event) }
  postMessage(data) {
    this.ready.then(() => globalThis.onmessage({ data })).catch(error => {
      this.emit('error', { data: String(error), currentTarget: this })
    })
  }
  terminate() {}
}
;(async () => {
  const { heicTo } = await import(pathToFileURL(modulePath).href)
  const image = await heicTo({ blob: new Blob([workerData.bytes]), type: 'bitmap' })
  parentPort.postMessage({ width: image.width, height: image.height, data: image.data }, [image.data.buffer])
})().catch(() => parentPort.postMessage({ error: 'HEIF decoding failed' }))
`

type DecodedImage = { width: number; height: number; data: Uint8Array }

async function runDecoder(bytes: Buffer): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER_SOURCE, {
      eval: true,
      workerData: { bytes, maxPixels: REVIEW_MAX_PHOTO_PIXELS },
      resourceLimits: {
        maxOldGenerationSizeMb: 384,
        maxYoungGenerationSizeMb: 32,
      },
    })
    let settled = false
    const finish = (error?: Error, image?: DecodedImage) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      void worker.terminate()
      if (error) reject(error)
      else resolve(image!)
    }
    const timeout = setTimeout(
      () => finish(new Error('HEIF decoding timed out')),
      DECODE_TIMEOUT_MS,
    )
    worker.once('message', (image: DecodedImage & { error?: string }) => {
      if (
        image.error ||
        !Number.isSafeInteger(image.width) ||
        !Number.isSafeInteger(image.height) ||
        image.width < 1 ||
        image.height < 1 ||
        image.width * image.height > REVIEW_MAX_PHOTO_PIXELS ||
        image.data?.byteLength !== image.width * image.height * 4
      ) {
        finish(new Error('Invalid HEIF image'))
      } else finish(undefined, image)
    })
    worker.once('error', () => finish(new Error('HEIF decoding failed')))
    worker.once('exit', () => {
      if (!settled) finish(new Error('HEIF decoder stopped before completion'))
    })
  })
}

// A Vercel instance may handle overlapping requests. Bound the expensive HEVC
// decode to one original per instance as well as one file per submitted batch.
let decoderQueue: Promise<unknown> = Promise.resolve()
export function decodeHeifPhoto(bytes: Buffer): Promise<DecodedImage> {
  const result = decoderQueue.then(() => runDecoder(bytes))
  decoderQueue = result.catch(() => undefined)
  return result
}
