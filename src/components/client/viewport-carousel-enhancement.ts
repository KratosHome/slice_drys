import './styles/carousel-enhancement.css'
import { Arrow } from '@/components/ui/arrow'

export const arrowPath = Arrow()
export { Splide } from '@splidejs/splide'

export function waitForCarouselStyles(
  root: HTMLElement,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let frame = 0
    let timer = 0
    let settled = false

    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      signal.removeEventListener('abort', abort)
      if (error) reject(error)
      else resolve()
    }
    const abort = () =>
      finish(
        new DOMException('Carousel activation was cancelled', 'AbortError'),
      )
    const check = () => {
      if (signal.aborted) {
        abort()
        return
      }
      if (
        window
          .getComputedStyle(root)
          .getPropertyValue('--carousel-enhancement-ready')
          .trim() === '1'
      ) {
        finish()
        return
      }
      frame = window.requestAnimationFrame(check)
    }

    signal.addEventListener('abort', abort, { once: true })
    timer = window.setTimeout(
      () => finish(new Error('Carousel styles did not finish loading')),
      5000,
    )
    check()
  })
}
