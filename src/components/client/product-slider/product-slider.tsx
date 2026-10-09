'use client'

import type { Options } from '@splidejs/splide'
import ViewportCarousel from '@/components/client/viewport-carousel'
import Product from '@/components/client/product'
import UnderlineWave from '@/components/ui/underline-wave'
import ProductListTracking from '@/components/google-analytics/product-list-tracking'
import { getProductAnalyticsItem, type AnalyticsItem } from '@/utils/analytics'

import { useId, useMemo } from 'react'

interface IProductSlider {
  products: IProductCard[]
  title: string
  message: string
}

export default function ProductSlider({
  products,
  title,
  message,
}: IProductSlider) {
  const titleId = useId()

  const splideOptions = useMemo<Options>(
    () => ({
      autoplay: true,
      type: 'slide',
      rewind: true,
      interval: 3000,
      perPage: Math.min(products.length, 3),
      perMove: 1,
      gap: '18px',
      focus: 0,
      arrows: true,
      pagination: true,
      // Splide must not remove Base UI's tabIndex=-1 from its hidden form input.
      focusableNodes:
        'a, button, textarea, input:not([aria-hidden="true"]):not([type="hidden"]), select, iframe',
      breakpoints: {
        768: {
          perPage: 1,
          gap: '0px',
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
    }),
    [products.length],
  )

  return (
    <section
      aria-labelledby={titleId}
      className="mx-auto -mt-[200px] max-w-[1280px] px-5 md:-mt-[100px] lg:-mt-[50px]"
    >
      <ProductListTracking
        listId="popular_products"
        listName={title}
        items={products
          .map((product) =>
            getProductAnalyticsItem(
              product,
              product.variant ?? product.variables[0],
            ),
          )
          .filter((item): item is AnalyticsItem => item !== undefined)}
      />
      <div className="md:px-[20px] md:pb-16">
        <h2
          id={titleId}
          className="title-rubik text-[clamp(32px,calc(32px+64*(100vw-375px)/1065),96px)] uppercase"
        >
          {title}
        </h2>
        <p className="relative w-fit pb-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] sm:ml-auto">
          {message}
          <UnderlineWave />
        </p>
      </div>
      <ViewportCarousel
        aria-labelledby={titleId}
        options={splideOptions}
        className="products-slider text-foreground bg-background mb-14 h-full w-full lg:mb-20"
      >
        {products.map((product, index) => (
          <li
            key={product._id}
            className="splide__slide px-2 py-8 sm:px-3 md:px-4"
          >
            <Product
              product={product}
              analyticsList={{ id: 'popular_products', name: title, index }}
            />
          </li>
        ))}
      </ViewportCarousel>
    </section>
  )
}
