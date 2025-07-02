'use client'

import { useEffect } from 'react'

export function useSplideConfig(
  sliderClass: '.products-slider' | '.insta-slider',
  dependenciesArray: IProduct[] | InstaFeed[],
) {
  useEffect(() => {
    const target = document.querySelector(sliderClass)

    if (!target) return

    const slideItems = target.querySelectorAll('li.splide__slide')

    slideItems.forEach((li) => {
      const role: string | null = li.getAttribute('role')

      if (role && ['presentation', 'tabpanel', 'none'].includes(role)) {
        li.removeAttribute('role')
      }
    })

    const handleResize = (): void => {
      let k: number

      switch (true) {
        case window.innerWidth >= 1280:
          k = 35
          break
        case window.innerWidth >= 1024:
          k = 32
          break
        case window.innerWidth >= 768:
          k = 28
          break
        case window.innerWidth < 768:
          k = 23
          break
        default:
          k = 30
      }

      const x: number = dependenciesArray.length * k

      const prev = document.querySelector(
        `${sliderClass} .splide__arrow--prev.custom__arrow-prev`,
      ) as HTMLElement
      const next = document.querySelector(
        `${sliderClass} .splide__arrow--next.custom__arrow-next`,
      ) as HTMLElement

      if (prev && next) {
        prev.style.setProperty('--tw-arrow-translate', `-${x}px`)
        next.style.setProperty('--tw-arrow-translate', `${x}px`)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)

    if (target) resizeObserver.observe(target)

    return () => {
      if (target) resizeObserver.unobserve(target)
    }
  }, [dependenciesArray, sliderClass])
}
