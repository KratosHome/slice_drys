import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Options } from '@splidejs/splide'
import Image from 'next/image'
import React from 'react'

const SliderWithThumbnails = ({
  images,
  img,
}: {
  images: string[]
  img?: string
}) => {
  const slides = img ? [img, ...images.filter((src) => src !== img)] : images

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
    <div className="flex w-full justify-center">
      <div className="relative aspect-[12/9] w-full max-w-[344px] lg:aspect-auto">
        <Image
          className="object-contain"
          src={img || images[0]}
          alt={`Slider ${img}`}
          fill
        />
      </div>
      {slides.length >= 3 && (
        <Splide
          options={thumbsOptions}
          className="flex justify-center"
          aria-labelledby={`product curd ${img}`}
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
