'use client'
import { useEffect } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import { Arrow } from '@/components/ui/arrow'
import Product from '@/components/client/product/product'
import UnderlineWave from '@/components/ui/underline-wave'

import '@splidejs/react-splide/css'
import '../styles/slider.css'
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
  useEffect(() => {
    const target = document.querySelector('.products-slider')
    if (!target) return
    const handleResize = () => {
      let k: number
      switch (true) {
        case window.innerWidth >= 1280:
          k = 35
          break
        case window.innerWidth >= 1024:
          k = 32
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
      const x = products.length * k
      const prev = document.querySelector(
        '.products-slider .splide__arrow--prev.custom__arrow-prev',
      ) as HTMLElement
      const next = document.querySelector(
        '.products-slider .splide__arrow--next.custom__arrow-next',
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
  }, [products])

  const splideOptions = {
    arrowPath: Arrow(),
    type: 'loop',
    autoplay: true,
    interval: 3000,
    perPage: Math.min(products.length, 3),
    perMove: 1,
    gap: '18px',
    focus: 0,
    arrows: true,
    pagination: true,
    breakpoints: {
      768: {
        perPage: 1,
        gap: '0',
      },
    },
    classes: {
      arrows: 'splide__arrows custom__arrows',
      arrow: 'splide__arrow custom__arrow',
      prev: 'splide__arrow--prev custom__arrow-prev',
      next: 'splide__arrow--next custom__arrow-next',
      pagination: 'splide__pagination custom__pagination',
      page: 'splide__pagination__page custom__pagination-page',
    },
  }

  return (
    <section
      aria-labelledby="popular-products"
      className="mx-auto -mt-[200px] max-w-[1280px] px-5 md:-mt-[100px] lg:-mt-[50px]"
    >
      <div className="md:px-[20px] md:pb-16">
        <h2 className="title-rubik text-[clamp(32px,calc(32px+64*(100vw-375px)/1065),96px)] uppercase">
          {title}
        </h2>
        <p className="font-poppins relative w-fit pb-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] sm:ml-auto">
          {message}
          <UnderlineWave />
        </p>
      </div>
      <Splide
        aria-labelledby={`${title} slider`}
        options={splideOptions}
        className="products-slider text-foreground bg-background mb-14 h-full w-full lg:mb-20"
      >
        {products.map((product) => (
          <SplideSlide key={product._id} className="px-2 py-8 sm:px-3 md:px-4">
            <Product product={product} />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  )
}
