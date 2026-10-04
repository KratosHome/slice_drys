'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Activate a whole carousel together so its adjacent slides and loop clones are ready.
export function useViewportImages() {
  const ref = useRef<HTMLElement>(null)
  const [enabled, setEnabled] = useState(false)
  const activate = useCallback(() => setEnabled(true), [])

  useEffect(() => {
    const element = ref.current
    if (!element || enabled) return

    let disposed = false
    if (!('IntersectionObserver' in window)) {
      queueMicrotask(() => {
        if (!disposed) activate()
      })
      return () => {
        disposed = true
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (disposed) return
        if (entries.some((entry) => entry.isIntersecting)) {
          activate()
          observer.disconnect()
        }
      },
      { rootMargin: '250px 0px' },
    )
    observer.observe(element)
    return () => {
      disposed = true
      observer.disconnect()
    }
  }, [activate, enabled])

  return { ref, enabled, activate }
}
