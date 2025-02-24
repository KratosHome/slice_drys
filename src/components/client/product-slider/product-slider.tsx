'use client'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide'

import { Arrow } from '@/components/client/ui/arrow'
import Product from '@/components/client/product/product'

import './product-slider.css'

interface ProductSlider {
  products: IProduct[]
  title: string
  message: string
}

export default function ProductSlider({
  products,
  title,
  message,
}: ProductSlider) {
  const splideOptions = {
    arrowPath: Arrow(),
    autoplay: true,
    loop: true,
    rewind: true,
    perPage: 3,
    perMove: 1,
    gap: '18px',
    pagination: true,
    arrows: true,
    breakpoints: {
      320: {
        perPage: 1.1,
        gap: '0px',
      },
      768: {
        perPage: 2.1,
        gap: '4px',
      },
      992: {
        perPage: 2.1,
        gap: '14px',
      },
      1024: {
        perPage: 3,
        gap: '14px',
      },
      1280: {
        perPage: 3,
        gap: '18px',
      },
    },
    classes: {
      arrows: 'splide__arrows product__arrows',
      arrow: 'splide__arrow product__arrow',
      prev: 'splide__arrow--prev product__arrow-prev',
      next: 'splide__arrow--next product__arrow-next',
      pagination: 'splide__pagination product__pagination',
      page: 'splide__pagination__page product__pagination-page',
    },
  }

  return (
    <section
      aria-labelledby="popular-products"
      className="mx-auto max-w-[1280px] px-5"
    >
      <div className="md:px-[20px] md:pb-16">
        <h1 className="title-rubik text-[clamp(32px,calc(32px+64*(100vw-375px)/1065),96px)] sm:mb-4">
          {title}
        </h1>
        <h2 className="slider-label relative grid place-content-start text-base sm:place-content-end md:text-lg lg:text-xl xl:text-2xl">
          {message}
        </h2>
      </div>
      <SplideTrack>
        <Splide
          aria-labelledby="Main slider"
          options={splideOptions}
          className="mb-14 h-full w-full lg:mb-20"
        >
          {products.map((product) => (
            <SplideSlide
              key={product._id}
              className="px-2 py-8 sm:px-3 md:px-4"
            >
              <Product product={product} />
            </SplideSlide>
          ))}
        </Splide>
      </SplideTrack>
    </section>
  )
}
