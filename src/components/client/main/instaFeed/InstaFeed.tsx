'use client'

import { useTranslations } from 'next-intl'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import InstaCard from './instaCard'
import { UnderlinedLink } from '../../ui/underlined-link'
import { Arrow } from '@/components/client/ui/arrow'

import { contacts } from '@/data/main/contacts'
import './InstaFeed.css'

type Props = Readonly<{ data: InstaFeed[] }>

export default function InstaFeed({ data }: Props) {
  const t = useTranslations('main.instafeed')
  return (
    <section className="section instafeed px-6 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-center gap-[clamp(0px,calc(0px+160*(100vw-768px)/672),160px)] md:justify-end">
          <h2 className="title-section text-balance text-center md:text-start">
            <span className="block md:hidden">{t('title')}</span>
            <span className="hidden md:block">{t('title-md')}</span>
          </h2>
          <UnderlinedLink
            href={contacts.instagram}
            className="md:order-0 order-1 hidden !min-w-[220px] md:flex"
          >
            @slicedrys
          </UnderlinedLink>
        </div>
        <Splide
          options={{
            arrowPath: Arrow(),
            type: 'loop',
            autoplay: true,
            interval: 3000,
            perPage: 3,
            perMove: 1,
            gap: '30px',
            focus: 0,
            arrows: true,
            pagination: true,
            breakpoints: {
              768: { perPage: 1 },
            },
            classes: {
              arrows: 'splide__arrows insta__arrows',
              arrow: 'splide__arrow insta__arrow',
              prev: 'splide__arrow--prev insta__arrow-prev',
              next: 'splide__arrow--next insta__arrow-next',
              pagination: 'splide__pagination insta__pagination',
              page: 'splide__pagination__page insta__pagination-page',
            },
          }}
          className="mt-[clamp(32px,calc(32px+68*(100vw-375px)/1065),100px)] w-full"
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
