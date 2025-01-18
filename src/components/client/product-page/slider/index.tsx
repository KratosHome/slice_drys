import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Options } from '@splidejs/splide'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

import './styles.css'

const SliderWithThumbnails = ({ images }: { images: string[] }) => {
  const mainRef = useRef<Splide>(null)
  const thumbsRef = useRef<Splide>(null)

  /**
   * Sync the main and thumbnail sliders after the component mounts.
   */
  useEffect(() => {
    if (mainRef.current && thumbsRef.current?.splide) {
      mainRef.current.sync(thumbsRef.current.splide)
    }
  }, [])

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
    <div>
      <Splide
        className="sm:py-16"
        options={mainOptions}
        ref={mainRef}
        aria-labelledby="The image slider"
      >
        {images.map((src, index) => (
          <SplideSlide key={src} className="p-2.5">
            <Image
              className="p-10 sm:p-0"
              src={src}
              alt={`Slider ${index}`}
              fill
            />
          </SplideSlide>
        ))}
      </Splide>

      <Splide
        options={thumbsOptions}
        ref={thumbsRef}
        className="flex justify-center"
        aria-label="The carousel with thumbnails"
      >
        {images.map((src, index) => (
          <SplideSlide key={src}>
            <Image src={src} alt={`Slider ${index}`} width={100} height={100} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}

export default SliderWithThumbnails
