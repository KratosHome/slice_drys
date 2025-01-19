import { Hero } from '@/components/client/hero/hero'
import ProductSlider from '@/components/client/slider/productSlider'
import AboutUs from '@/components/client/about-us/about-us'
import Reviews from '@/components/client/reviews/Review'

import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'

export default async function Home(props: {
  params: Params
  searchParams: ISearchParams
}) {
  const { locale } = await props.params

  const productsData = await getProductsSliderMain(locale)

  return (
    <div>
      <Hero />
      <ProductSlider
        title={'ТОПОВІ СУШЕНИКИ'}
        message={'найсмачніші кусь-топчики'}
        products={productsData.products}
      />
      <AboutUs />
      <Reviews />
    </div>
  )
}
