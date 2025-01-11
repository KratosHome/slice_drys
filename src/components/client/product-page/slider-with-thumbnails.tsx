import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Options } from '@splidejs/splide'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

import './slider.css'

const SliderWithThumbnails = ({ images }: { images: string[] }) => {
  /**
   * References for the main and thumbnail Splide components.
   */
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
    gap: '1rem',
    pagination: false,
    width: '400px',
    height: '400px',
    arrows: false,
  }

  const thumbsOptions: Options = {
    rewind: true,
    gap: '1rem',
    pagination: false,
    fixedWidth: 100,
    fixedHeight: 100,
    cover: true,
    focus: 'center',
    isNavigation: true,
    arrows: false,
  }

  /**
   * Render slides.
   *
   * @return Slide nodes.
   */
  const renderSlides = () => {
    return images.map((src, index) => (
      <SplideSlide key={src} className="p-2.5">
        <Image src={src} alt={`Slider ${index}`} fill />
      </SplideSlide>
    ))
  }

  return (
    <div>
      <Splide
        className="py-16"
        options={mainOptions}
        ref={mainRef}
        aria-labelledby="thumbnail-slider-example"
      >
        {renderSlides()}
      </Splide>

      <Splide
        options={thumbsOptions}
        ref={thumbsRef}
        aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
      >
        {images.map((src, index) => (
          <SplideSlide key={src} className="p-2.5">
            <Image src={src} alt={`Slider ${index}`} width={100} height={100} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}

export default SliderWithThumbnails
