'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Options } from '@splidejs/splide'
import ViewportCarousel from '@/components/client/viewport-carousel'
import ViewportImage from '@/components/client/viewport-image'
import { useViewportImages } from '@/components/client/use-viewport-images'

const ImagesEnabled = createContext(false)

const splideOptions: Options = {
  type: 'loop',
  perPage: 3,
  perMove: 1,
  pagination: true,
  arrows: true,
  autoplay: true,
  interval: 3000,
  focus: 'center',
  breakpoints: {
    768: { perPage: 1 },
  },
  classes: {
    arrows: 'splide__arrows custom__arrows',
    arrow: 'splide__arrow custom__arrow',
    prev: 'splide__arrow--prev custom__arrow-prev',
    next: 'splide__arrow--next custom__arrow-next',
    pagination: 'splide__pagination custom__pagination',
    page: 'splide__pagination__page custom__pagination-page',
  },
}

export function BlogImage({
  src,
  alt,
  fetchPriority,
}: {
  src: string
  alt: string
  fetchPriority: 'auto' | 'low'
}) {
  const enabled = useContext(ImagesEnabled)

  return (
    <ViewportImage
      enabled={enabled}
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1439px) 30vw, 400px"
      fetchPriority={fetchPriority}
      className="rounded-[12px_12px_0_0] object-cover"
    />
  )
}

export default function BlogCarousel({
  children,
  header,
  titleId,
}: {
  children: ReactNode
  header: ReactNode
  titleId: string
}) {
  const { ref, enabled, activate } = useViewportImages()

  return (
    <ImagesEnabled.Provider value={enabled}>
      <section
        ref={ref}
        onFocusCapture={activate}
        aria-labelledby={titleId}
        className="section about-us bg-foreground text-background"
      >
        <div className="about__wrapper">
          {header}
          <div className="mt-[40px] w-full max-w-[400px] md:mt-[80px] md:max-w-none">
            <ViewportCarousel
              aria-labelledby={titleId}
              className="blog-slider"
              options={splideOptions}
              refreshKey={enabled}
            >
              {children}
            </ViewportCarousel>
          </div>
        </div>
      </section>
    </ImagesEnabled.Provider>
  )
}
