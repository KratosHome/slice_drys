'use client'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/core'
import '@splidejs/react-splide/css'
import { Arrow } from '@/components/client/ui/arrow'
import './productSlider.css'
import Product from '@/components/client/product/product'
import { rubikDoodleShadow } from '@/fonts/fonts'

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
    // autoplay: true,
    omitEnd: true,
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
    <div className="mx-auto mb-48 mt-10 max-w-6xl px-0 lg:px-4">
      <div className="px-[20px] py-16 md:py-20 lg:py-24 xl:py-[130px]">
        <h2
          className={`${rubikDoodleShadow.className} mb-2 text-[32px] sm:mb-4 sm:text-5xl md:mb-6 md:text-6xl lg:mb-8 lg:text-7xl xl:mb-12 xl:text-8xl`}
        >
          {title}
        </h2>
        <div className="slider-label relative grid place-content-start text-base sm:place-content-end md:text-lg lg:text-xl xl:text-2xl">
          {message}
        </div>
      </div>
      <Splide
        aria-labelledby="Main slider"
        options={splideOptions}
        className="mb-28 h-full max-w-6xl"
      >
        {products.map((product) => (
          <SplideTrack key={product._id}>
            <SplideSlide className="px-2 py-8 sm:px-3 md:px-4">
              <Product product={product} />
            </SplideSlide>
          </SplideTrack>
        ))}
      </Splide>
    </div>
  )
}
