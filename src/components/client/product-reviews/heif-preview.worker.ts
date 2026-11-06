import { heicTo } from 'heic-to/csp'
import {
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_MAX_PHOTO_PIXELS,
} from '@/constants/product-review'

// The CSP build creates its decoder worker lazily. Keep it inside this disposable
// worker so cancelling a preview never leaves a decoder running in the page.
const NativeWorker = Worker
const decoders = new Set<Worker>()
const decoderUrls = new Set<string>()
const timers = new Set<ReturnType<typeof setTimeout>>()

globalThis.Worker = class extends NativeWorker {
  constructor(url: string | URL, options?: WorkerOptions) {
    super(url, options)
    decoders.add(this)
    if (String(url).startsWith('blob:')) decoderUrls.add(String(url))
    timers.add(
      setTimeout(() => {
        this.terminate()
        self.postMessage({ error: 'Photo preview timed out' })
      }, 18_000),
    )
  }
}

function dispose() {
  timers.forEach(clearTimeout)
  timers.clear()
  decoders.forEach((worker) => worker.terminate())
  decoders.clear()
  decoderUrls.forEach((url) => URL.revokeObjectURL(url))
  decoderUrls.clear()
}

self.onmessage = async (event: MessageEvent<{ bytes: ArrayBuffer }>) => {
  let bitmap: ImageBitmap | undefined
  try {
    if (
      !(event.data.bytes instanceof ArrayBuffer) ||
      !event.data.bytes.byteLength ||
      event.data.bytes.byteLength > REVIEW_MAX_PHOTO_BYTES
    ) {
      throw new Error('Invalid original photo size')
    }
    bitmap = await heicTo({
      blob: new Blob([event.data.bytes]),
      type: 'bitmap',
    })
    const { width, height } = bitmap
    if (!width || !height || width * height > REVIEW_MAX_PHOTO_PIXELS)
      throw new Error('Image dimensions exceed preview limit')
    const scale = Math.min(1, 320 / Math.max(width, height))
    const canvas = new OffscreenCanvas(
      Math.max(1, Math.round(width * scale)),
      Math.max(1, Math.round(height * scale)),
    )
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: 0.8,
    })
    self.postMessage({ blob })
  } catch {
    self.postMessage({ error: 'Photo preview failed' })
  } finally {
    bitmap?.close()
    dispose()
  }
}
