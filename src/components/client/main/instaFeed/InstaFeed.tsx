'use client'

import { useEffect } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import InstaCard from './instaCard'
import { UnderlinedLink } from '../../ui/underlined-link'
import { Arrow } from '@/components/client/ui/arrow'

import { contacts } from '@/data/main/contacts'
import './InstaFeed.css'

type Props = Readonly<{ data: InstaFeed[]; title: string }>

export default function InstaFeed({ data, title }: Props) {
  useEffect(() => {
    const target = document.querySelector('.insta-slider')
    if (!target) return
    const handleResize = () => {
      let k: number
      switch (true) {
        case window.innerWidth >= 1280:
          k = 35
          break
        case window.innerWidth >= 1024:
          k = 30
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
      const x = data.length * k
      const prev = document.querySelector(
        '.insta-slider .splide__arrow--prev.custom__arrow-prev',
      ) as HTMLElement
      const next = document.querySelector(
        '.insta-slider .splide__arrow--next.custom__arrow-next',
      ) as HTMLElement

      if (prev && next) {
        prev.style.setProperty('--tw-arrow-translate', `-${x}px`)
        next.style.setProperty('--tw-arrow-translate', `${x}px`)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)

    if (target) {
      resizeObserver.observe(target)
    }

    return () => {
      if (target) {
        resizeObserver.unobserve(target)
      }
    }
  }, [data])

  return (
    <section className="section instafeed px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-center gap-[clamp(0px,calc(0px+160*(100vw-768px)/672),160px)] md:justify-end">
          <h2 className="title-rubik text-balance text-center text-[42px] md:text-start lg:text-[64px]">
            {title}
          </h2>
          <UnderlinedLink
            href={contacts.instagram}
            className="md:order-0 order-1 hidden !min-w-[220px] md:flex"
          >
            @slicedrys
          </UnderlinedLink>
        </div>
        <Splide
          aria-labelledby="Insta Feed"
          options={{
            arrowPath: Arrow(),
            type: 'loop',
            autoplay: true,
            interval: 3000,
            perPage: 3,
            perMove: 1,
            focus: 0,
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
          }}
          className="insta-slider mt-[clamp(32px,calc(32px+68*(100vw-375px)/1065),100px)]"
        >
          {data.map((post, index) => (
            <SplideSlide key={index} className="flex flex-col items-center">
              <InstaCard post={post} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  )
}
