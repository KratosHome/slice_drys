'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import loading from './rubik-doodle-shadow-loading.json'
import { rubikDoodleShadow } from './rubik-doodle-shadow'

const pendingStylesheets = new Map<string, Promise<void>>()

function registerStylesheet(href: string) {
  const existing = pendingStylesheets.get(href)
  if (existing) return existing

  const promise = new Promise<void>((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.dataset.rubikRemainder = ''
    link.onload = () => resolve()
    link.onerror = () => {
      link.remove()
      pendingStylesheets.delete(href)
      reject(new Error('The remaining Rubik font stylesheet could not load'))
    }
    document.head.append(link)
  })
  pendingStylesheets.set(href, promise)
  return promise
}

interface RubikDoodleShadowFontsProps {
  locale: ILocale
}

export default function RubikDoodleShadowFonts({
  locale,
}: RubikDoodleShadowFontsProps) {
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const home = loading.home[locale]
  const preloads = isHome ? home.preloads : rubikDoodleShadow.preloads[locale]

  useEffect(() => {
    const root = document.documentElement
    if (!isHome) {
      root.dataset.rubikFontStage = 'full'
      return
    }

    let disposed = false
    let requested = false
    const cleanups: Array<() => void> = []
    root.dataset.rubikFontStage = 'critical'

    const activate = () => {
      if (disposed || requested) return
      requested = true
      root.dataset.rubikFontStage = 'remaining-loading'
      void registerStylesheet(home.remaining)
        .then(() => {
          if (disposed) return
          root.dataset.rubikFontStage = 'remaining-registered'
          cleanups.forEach((cleanup) => cleanup())
        })
        .catch(() => {
          // Keep readable, metric-adjusted text and allow the next interaction
          // to retry. Font availability never gates scrolling or navigation.
          requested = false
          if (!disposed) root.dataset.rubikFontStage = 'fallback'
        })
    }

    // The first screen already has its heading glyphs. Register the remaining
    // faces when content approaches the viewport or the visitor interacts,
    // including restored scroll positions. Readable fallback text stays visible.
    const events = [
      'scroll',
      'wheel',
      'touchstart',
      'pointerdown',
      'keydown',
      'focusin',
      'hashchange',
    ] as const
    events.forEach((event) => {
      window.addEventListener(event, activate, { passive: true })
      cleanups.push(() => window.removeEventListener(event, activate))
    })

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) activate()
        },
        { rootMargin: '150px' },
      )
      document
        .querySelectorAll(
          'main .about-us, main [aria-labelledby="reviews"], main [aria-labelledby="FAQ"], main .instafeed, footer',
        )
        .forEach((section) => observer.observe(section))
      cleanups.push(() => observer.disconnect())
    }

    if (window.scrollY > 0 || window.location.hash) activate()

    return () => {
      disposed = true
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [home, isHome, pathname])

  return (
    <>
      {isHome ? (
        <style data-rubik-critical={locale}>{home.criticalRules}</style>
      ) : (
        <link
          rel="stylesheet"
          href={loading.full}
          precedence="rubik-doodle-shadow"
        />
      )}
      {preloads.map((href) => (
        <link
          key={href}
          rel="preload"
          as="font"
          type="font/woff2"
          href={href}
          crossOrigin="anonymous"
        />
      ))}
      {isHome ? (
        <noscript>
          <link rel="stylesheet" href={home.remaining} />
        </noscript>
      ) : null}
    </>
  )
}
