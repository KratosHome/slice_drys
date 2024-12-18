import { Splide, SplideSlide } from '@splidejs/react-splide'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'
import Product from '@/components/client/product/product'
import { IProductLocal } from '@/types/product'
import '@splidejs/react-splide/css/core'
import '@splidejs/react-splide/css'
import { Rubik_Doodle_Shadow } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Arrow } from '@/components/client/ui/arrow'

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik-doodle-shadow',
  weight: ['400'],
})

export default function ProductSlider() {
  const splideOptions = {
    arrowPath: Arrow(),
    type: 'loop',
    autoplay: true,
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
        perPage: 2.2,
        gap: '4px',
      },
      992: {
        perPage: 2.2,
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

  const [products, setProducts] = useState<IProductLocal[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductsSliderMain()
        setProducts(data)
      } catch (err) {
        setError('Не вдалося завантажити продукти')
      }
    }
    fetchData().then((r) => r)
  }, [])

  if (error) return <div>{error}</div>
  if (!products.length) return <div>Завантаження...</div>

  return (
    <div className="mx-auto mb-12 mt-10 max-w-6xl px-0 lg:px-4">
      <div className="py-[51px] pr-4 sm:py-16 md:py-20 lg:py-24 xl:py-[147px]">
        <h2
          className={`${rubikDoodleShadow.className} mb-2 text-[32px] sm:mb-4 sm:text-5xl md:mb-6 md:text-6xl lg:mb-8 lg:text-7xl xl:mb-12 xl:text-8xl`}
        >
          ТОПОВІ СУШЕНИКИ
        </h2>
        <div className="slider-label relative grid place-content-start text-base sm:place-content-end md:text-lg lg:text-xl xl:text-2xl">
          найсмачніші кусь-топчики
        </div>
      </div>
      <Splide options={splideOptions} className="mb-48 mt-10 h-full max-w-6xl">
        {products.map((product) => (
          <SplideSlide key={product._id} className="px-2 py-8 sm:px-3 md:px-4">
            <Product
              key={product._id}
              product={product}
              variables={product.variables}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
