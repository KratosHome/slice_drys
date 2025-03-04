import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Options } from '@splidejs/splide'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

import './styles.css'

const SliderWithThumbnails = ({
  images,
  img,
}: {
  images: string[]
  img?: string
}) => {
  const slides = img ? [img, ...images.filter((src) => src !== img)] : images

  const mainRef = useRef<any>(null)
  const thumbsRef = useRef<any>(null)

  useEffect(() => {
    if (slides.length >= 3 && mainRef.current && thumbsRef.current?.splide) {
      mainRef.current.sync(thumbsRef.current.splide)
    }
  }, [slides.length])

  const mainOptions: Options = {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '2.1rem',
    pagination: false,
    height: '400px',
    arrows: false,
  }

  const thumbsOptions: Options = {
    gap: '1.625rem',
    pagination: false,
    fixedWidth: 100,
    fixedHeight: 100,
    cover: true,
    focus: 0,
    isNavigation: true,
    arrows: false,
    breakpoints: {
      640: {
        fixedWidth: 80,
        fixedHeight: 80,
      },
    },
  }

  return (
    <div className="w-full">
      <div className="relative h-full w-full">
        <Image
          className="object-contain"
          src={img}
          alt={`Slider ${img}`}
          fill
        />
      </div>
      {slides.length >= 3 && (
        <Splide
          options={thumbsOptions}
          ref={thumbsRef}
          className="flex justify-center"
          aria-label="The carousel with thumbnails"
        >
          {slides.map((src, index) => (
            <SplideSlide key={src}>
              <Image
                src={src}
                alt={`Slider ${index}`}
                width={100}
                height={100}
              />
            </SplideSlide>
          ))}
        </Splide>
      )}
    </div>
  )
}

export default SliderWithThumbnails
