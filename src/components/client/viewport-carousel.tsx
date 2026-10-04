'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import type { Options, Splide as SplideInstance } from '@splidejs/splide'
import { cn } from '@/utils/cn'

interface ViewportCarouselProps {
  children: ReactNode
  className?: string
  options: Options
  refreshKey?: boolean | number | string
  'aria-labelledby': string
}

// Keep the cards in the server HTML; load and mount the carousel as they approach.
export default function ViewportCarousel({
  children,
  className,
  options,
  refreshKey,
  'aria-labelledby': labelledBy,
}: ViewportCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<SplideInstance | undefined>(undefined)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const restoreMarkup = () => {
      root.setAttribute('aria-labelledby', labelledBy)
      root.setAttribute('role', options.role ?? 'region')
      root.style.setProperty(
        '--carousel-per-page',
        String(options.perPage ?? 1),
      )
      root.style.setProperty('--carousel-gap', String(options.gap ?? '0px'))
    }
    restoreMarkup()

    let disposed = false
    let loading = false
    let visible = false
    let carousel: SplideInstance | undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateAutoplay = () => {
      if (!carousel || !options.autoplay) return
      const focused = root.contains(document.activeElement)
      const popupOpen = root.querySelector('[aria-expanded="true"]') !== null
      const hovered =
        window.matchMedia('(hover: hover)').matches && root.matches(':hover')
      if (
        visible &&
        !reducedMotion.matches &&
        !focused &&
        !popupOpen &&
        !hovered &&
        !document.hidden
      )
        carousel.Components.Autoplay.play()
      else carousel.Components.Autoplay.pause()
    }
    const afterFocusChange = () =>
      queueMicrotask(() => {
        if (!disposed) updateAutoplay()
      })

    const updateArrows = () => {
      const width = window.innerWidth
      const step =
        width >= 1280 ? 35 : width >= 1024 ? 32 : width >= 768 ? 28 : 23
      const offset =
        root.querySelectorAll('.splide__slide:not(.splide__slide--clone)')
          .length * step
      root
        .querySelector<HTMLElement>('.splide__arrow--prev')
        ?.style.setProperty('--tw-arrow-translate', `-${offset}px`)
      root
        .querySelector<HTMLElement>('.splide__arrow--next')
        ?.style.setProperty('--tw-arrow-translate', `${offset}px`)
    }

    const activate = async () => {
      if (loading || disposed) return
      loading = true
      try {
        const { Splide } = await import('@splidejs/splide')
        if (disposed) return
        const track = root.querySelector<HTMLElement>('.splide__track')
        const slides = root.querySelectorAll<HTMLElement>('.splide__slide')
        const slideStep =
          slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0
        const start =
          slideStep && track ? Math.round(track.scrollLeft / slideStep) : 0
        if (track) track.scrollLeft = 0
        carousel = new Splide(root, {
          ...options,
          start: options.start ?? start,
          labelledby: labelledBy,
          autoplay: options.autoplay ? 'pause' : false,
          pauseOnFocus: false,
          pauseOnHover: false,
          reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: 'pause' },
        })
        // Splide recreates arrows when responsive or motion options change.
        carousel.on('arrows:mounted refresh', updateArrows)
        carousel.mount()
        carouselRef.current = carousel
        updateAutoplay()
      } catch {
        carousel?.destroy(true)
        carousel = undefined
        carouselRef.current = undefined
        restoreMarkup()
        // The server-rendered, horizontally scrollable cards remain usable.
        loading = false
      }
    }

    const resizeObserver = new ResizeObserver(updateArrows)
    const controlsObserver = new MutationObserver(updateAutoplay)
    controlsObserver.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-expanded'],
    })
    resizeObserver.observe(root)
    reducedMotion.addEventListener('change', updateAutoplay)
    root.addEventListener('mouseenter', updateAutoplay)
    root.addEventListener('mouseleave', updateAutoplay)
    root.addEventListener('focusin', updateAutoplay)
    root.addEventListener('focusout', afterFocusChange)
    document.addEventListener('visibilitychange', updateAutoplay)

    const approaching = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void activate()
          approaching.disconnect()
        }
      },
      { rootMargin: '250px' },
    )
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updateAutoplay()
    })
    approaching.observe(root)
    visibility.observe(root)

    return () => {
      disposed = true
      approaching.disconnect()
      visibility.disconnect()
      resizeObserver.disconnect()
      controlsObserver.disconnect()
      reducedMotion.removeEventListener('change', updateAutoplay)
      root.removeEventListener('mouseenter', updateAutoplay)
      root.removeEventListener('mouseleave', updateAutoplay)
      root.removeEventListener('focusin', updateAutoplay)
      root.removeEventListener('focusout', afterFocusChange)
      document.removeEventListener('visibilitychange', updateAutoplay)
      carousel?.destroy(true)
      carouselRef.current = undefined
      restoreMarkup()
    }
  }, [options, labelledBy])

  useEffect(() => {
    carouselRef.current?.refresh()
  }, [children, refreshKey])

  return (
    <div
      ref={rootRef}
      aria-labelledby={labelledBy}
      role={options.role ?? 'region'}
      className={cn('splide viewport-carousel', className)}
      style={
        {
          '--carousel-per-page': options.perPage ?? 1,
          '--carousel-gap': options.gap ?? '0px',
        } as CSSProperties
      }
    >
      <div className="splide__track">
        <ul className="splide__list">{children}</ul>
      </div>
    </div>
  )
}
