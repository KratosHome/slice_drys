'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import loading from './rubik-doodle-shadow-loading.json'
import { rubikDoodleShadow } from './rubik-doodle-shadow'
import {
  getRubikFontProfile,
  hasUncoveredCharacters,
} from './rubik-font-profile'

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
  const profile = getRubikFontProfile(pathname, locale)
  const isHome = profile === 'home'
  const isFull = profile === 'full'
  const home = loading.home[locale]
  const inner = loading.inner[locale]
  const preloads = isHome
    ? home.preloads
    : isFull
      ? rubikDoodleShadow.preloads[locale]
      : profile === 'headings'
        ? [inner.headingPreload]
        : []
  const criticalRules = isHome
    ? home.criticalRules
    : inner.controlsRules + (profile === 'headings' ? inner.headingRules : '')
  const remaining = isHome ? home.remaining : inner.remaining

  useEffect(() => {
    const root = document.documentElement
    if (isFull) {
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
      void registerStylesheet(remaining)
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

    // First-screen text has its glyphs in the inline critical rules. Register
    // the remaining faces when needed content approaches the viewport, or on
    // interaction. Never hide text or leave it waiting on a fixed timer.
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
      if (isHome) {
        document
          .querySelectorAll(
            'main .about-us, main [aria-labelledby="reviews"], main [aria-labelledby="FAQ"], main .instafeed, footer',
          )
          .forEach((section) => observer.observe(section))
      } else {
        const covered = new Set(
          inner.controlsCharacters +
            (profile === 'headings' ? inner.headingCharacters : ''),
        )
        const observed = new Set<Element>()
        const observeMissingGlyphs = () => {
          if (disposed || requested) return
          document
            .querySelectorAll(
              '[class*="font-rubik"], .title-rubik, .title-section, [style*="--font-rubik-doodle-shadow"]',
            )
            .forEach((element) => {
              const style = getComputedStyle(element)
              if (!style.fontFamily.includes('Rubik Doodle Shadow')) return
              const text = element.textContent ?? ''
              const renderedText =
                style.textTransform === 'uppercase'
                  ? text.toUpperCase()
                  : style.textTransform === 'lowercase'
                    ? text.toLowerCase()
                    : text
              if (hasUncoveredCharacters(renderedText, covered)) {
                observer.observe(element)
                observed.add(element)
              } else if (observed.delete(element)) {
                observer.unobserve(element)
              }
            })
        }
        observeMissingGlyphs()
        // Recommendations and dialogs can arrive after the first React effect.
        // Recheck their actual text without polling or observing every frame.
        let frame: number | undefined
        const mutations = new MutationObserver(() => {
          if (disposed || requested || frame !== undefined) return
          frame = requestAnimationFrame(() => {
            frame = undefined
            observeMissingGlyphs()
          })
        })
        mutations.observe(document.body, {
          childList: true,
          characterData: true,
          subtree: true,
        })
        cleanups.push(() => {
          mutations.disconnect()
          if (frame !== undefined) cancelAnimationFrame(frame)
        })
      }
      cleanups.push(() => observer.disconnect())
    } else {
      // Browsers without IntersectionObserver still receive complete glyphs.
      activate()
    }

    if (window.scrollY > 0 || window.location.hash) activate()

    return () => {
      disposed = true
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [inner, isFull, isHome, pathname, profile, remaining])

  return (
    <>
      {isFull ? (
        <link
          rel="stylesheet"
          href={loading.full}
          precedence="rubik-doodle-shadow"
        />
      ) : (
        <style data-rubik-critical={locale} data-rubik-profile={profile}>
          {criticalRules}
        </style>
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
      {!isFull ? (
        <noscript>
          <link rel="stylesheet" href={remaining} />
        </noscript>
      ) : null}
    </>
  )
}
