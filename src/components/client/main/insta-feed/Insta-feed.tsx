'use client'

import { contacts } from '@/data/contacts'

import type { Options } from '@splidejs/splide'
import ViewportCarousel from '@/components/client/viewport-carousel'
import { useViewportImages } from '@/components/client/use-viewport-images'
import InstaCard from './insta-card'
import { UnderlinedLink } from '@/components/ui/underlined-link'
import { Arrow } from '@/components/ui/arrow'

import { useId, useMemo } from 'react'

interface IInstaFeedProps {
  data: InstaFeed[]
  title: string
}

export default function InstaFeed({ data, title }: IInstaFeedProps) {
  const titleId = useId()
  const images = useViewportImages()
  const posts = data.slice(0, 5)

  const splideOptions = useMemo<Options>(
    () => ({
      arrowPath: Arrow(),
      type: 'loop',
      autoplay: true,
      interval: 3000,
      perPage: 3,
      perMove: 1,
      focus: 'center',
      arrows: true,
      pagination: true,
      breakpoints: {
        768: { perPage: 1 },
      },
      classes: {
        arrows: 'splide__arrows custom__arrows',
        arrow: 'splide__arrow custom__arrow mx-16 md:mx-12',
        prev: 'splide__arrow--prev custom__arrow-prev',
        next: 'splide__arrow--next custom__arrow-next',
        pagination: 'splide__pagination custom__pagination',
        page: 'splide__pagination__page custom__pagination-page',
      },
    }),
    [],
  )

  return (
    <section
      ref={images.ref}
      onFocusCapture={images.activate}
      className="section instafeed px-6 py-12"
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-center gap-[clamp(0px,calc(0px+160*(100vw-768px)/672),160px)] md:justify-end">
          <h2
            id={titleId}
            className="title-rubik text-center text-[42px] text-balance md:text-start lg:text-[64px]"
          >
            {title}
          </h2>
          <UnderlinedLink
            href={contacts.instagram}
            target="_blank"
            className="order-1 hidden min-w-[220px]! md:order-0 md:flex"
          >
            @slicedrys
          </UnderlinedLink>
        </div>
        <ViewportCarousel
          aria-labelledby={titleId}
          options={splideOptions}
          className="insta-slider mt-[clamp(32px,calc(32px+68*(100vw-375px)/1065),100px)]"
        >
          {posts.map((post, index) => (
            <li
              key={index}
              className="splide__slide flex flex-col items-center"
            >
              <InstaCard
                post={post}
                imagesEnabled={images.enabled}
                imagePriority={
                  index < 2 || index === posts.length - 1 ? 'auto' : 'low'
                }
              />
            </li>
          ))}
        </ViewportCarousel>
      </div>
    </section>
  )
}
