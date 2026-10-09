'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export default function HeaderShell({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame: number | undefined

    const update = () => {
      frame = undefined
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY) / (desktop.matches ? 100 : 200),
      )
      const eased = reducedMotion.matches ? 0 : 1 - (1 - progress) ** 2
      header.style.setProperty('--header-progress', String(eased))
      header.dataset.compact = String(eased === 1)
      header.dataset.scrolled = String(eased > 0)
    }
    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    desktop.addEventListener('change', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      desktop.removeEventListener('change', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="site-header bg-background sticky top-0 z-50 mx-auto w-full max-w-[1240px] border-b-[1px] border-[#E4E4E4] px-5"
    >
      {children}
    </header>
  )
}
