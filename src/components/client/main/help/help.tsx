'use client'
import { FC } from 'react'
import Image from 'next/image'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import { Arrow } from '@/components/client/ui/arrow'
import Button from '@/components/client/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { AspectRatio } from '../../ui/aspect-ratio'

import './help.css'

interface HelpProps {
  data: {
    title: string
    subTitle: string
    text: string
    button: string
    link: string
    img: {
      src: string
      alt: string
      link: string
    }[]
  }
}

const Help: FC<HelpProps> = ({ data }) => {
  const handleImageClick = (link: string) => {
    window.open(link, '_blank')
  }
  const isMobile = useIsMobile()
  return (
    <section aria-labelledby="help" className="help section">
      <div className="help__wrapper">
        <div className="splide-wrapper">
          <Splide
            options={{
              arrowPath: Arrow(),
              type: 'loop',
              perPage: 1,
              pagination: isMobile ? false : true,
              arrows: isMobile ? false : true,
              autoplay: true,
              interval: 3000,
              classes: {
                arrows: 'splide__arrows help__arrows',
                arrow: 'splide__arrow help__arrow',
                prev: 'splide__arrow--prev help__arrow-prev',
                next: 'splide__arrow--next help__arrow-next',
                pagination: 'splide__pagination help__pagination',
                page: 'splide__pagination__page help__pagination-page',
              },
            }}
          >
            {data?.img.map((slide, index) => (
              <SplideSlide key={index}>
                <AspectRatio ratio={isMobile ? 1.42 : 1.32} className="h-full">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill={true}
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>
              </SplideSlide>
            ))}
          </Splide>
        </div>
        <div className="help__content">
          <h1 className="help__title font-rubik">{data.title}</h1>
          <p className="help__text">{data.text}</p>
          <h2 className="help__subtitle">{data.subTitle}</h2>
          <Button
            variant="transparent"
            className="help__btn"
            onClick={() => handleImageClick(data.link)}
          >
            <span>{data.button}</span>
            <svg
              width="42"
              height="15"
              viewBox="0 0 42 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M41.7071 8.20711C42.0976 7.81658 42.0976 7.18342 41.7071 6.79289L35.3431 0.428932C34.9526 0.0384079 34.3195 0.0384079 33.9289 0.428932C33.5384 0.819456 33.5384 1.45262 33.9289 1.84315L39.5858 7.5L33.9289 13.1569C33.5384 13.5474 33.5384 14.1805 33.9289 14.5711C34.3195 14.9616 34.9526 14.9616 35.3431 14.5711L41.7071 8.20711ZM0 8.5H41V6.5H0V8.5Z"
                fill="#FBFBFB"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Help
