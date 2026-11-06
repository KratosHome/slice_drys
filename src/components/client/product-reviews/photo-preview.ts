import {
  REVIEW_MAX_PHOTO_PIXELS,
  reviewPhotoMimeType,
} from '@/constants/product-review'

function abortError(): DOMException {
  return new DOMException('Photo preview cancelled', 'AbortError')
}

async function nativePreview(file: File, signal: AbortSignal): Promise<Blob> {
  if (signal.aborted) throw abortError()
  const url = URL.createObjectURL(file)
  const image = new Image()
  try {
    await new Promise<void>((resolve, reject) => {
      const clear = () => {
        clearTimeout(timer)
        image.onload = null
        image.onerror = null
        signal.removeEventListener('abort', abort)
      }
      const abort = () => {
        clear()
        image.src = ''
        reject(abortError())
      }
      const timer = setTimeout(() => {
        clear()
        image.src = ''
        reject(new Error('Photo preview timed out'))
      }, 20_000)
      image.onload = () => {
        clear()
        resolve()
      }
      image.onerror = () => {
        clear()
        reject(new Error('Photo decode failed'))
      }
      signal.addEventListener('abort', abort, { once: true })
      image.src = url
    })
    if (signal.aborted) throw abortError()
    const width = image.naturalWidth
    const height = image.naturalHeight
    if (!width || !height || width * height > REVIEW_MAX_PHOTO_PIXELS)
      throw new Error('Image dimensions exceed preview limit')
    const scale = Math.min(1, 320 / Math.max(width, height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('Preview encoding failed')),
        'image/webp',
        0.8,
      ),
    )
  } finally {
    image.src = ''
    URL.revokeObjectURL(url)
  }
}

async function heifPreview(file: File, signal: AbortSignal): Promise<Blob> {
  if (signal.aborted) throw abortError()
  const worker = new Worker(
    new URL('./heif-preview.worker.ts', import.meta.url),
    { type: 'module' },
  )
  try {
    const bytes = await file.arrayBuffer()
    if (signal.aborted) throw abortError()
    return await new Promise<Blob>((resolve, reject) => {
      const clear = () => {
        clearTimeout(timer)
        signal.removeEventListener('abort', abort)
      }
      const abort = () => {
        clear()
        reject(abortError())
      }
      const timer = setTimeout(() => {
        clear()
        reject(new Error('Photo preview timed out'))
      }, 20_000)
      signal.addEventListener('abort', abort, { once: true })
      worker.onerror = () => {
        clear()
        reject(new Error('Photo preview failed'))
      }
      worker.onmessage = (
        event: MessageEvent<{ blob?: Blob; error?: string }>,
      ) => {
        clear()
        if (event.data.blob instanceof Blob) resolve(event.data.blob)
        else reject(new Error('Photo preview failed'))
      }
      worker.postMessage({ bytes }, [bytes])
    })
  } finally {
    worker.terminate()
  }
}

/** Only the preview is resized here. The original File is uploaded unchanged. */
export async function createReviewPhotoPreview(
  file: File,
  signal: AbortSignal,
): Promise<Blob> {
  try {
    return await nativePreview(file, signal)
  } catch (error) {
    if (
      signal.aborted ||
      !['image/heic', 'image/heif'].includes(reviewPhotoMimeType(file))
    )
      throw error
    return heifPreview(file, signal)
  }
}
