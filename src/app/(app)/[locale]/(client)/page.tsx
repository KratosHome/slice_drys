import { Hero } from '@/components/client/hero/hero'
import ProductSlider from '@/components/client/slider/productSlider'
import AboutUs from '@/components/client/about-us/about-us'
import Reviews from '@/components/client/reviews/Reviews'
import JoinUs from '@/components/client/join-us/JoinUs'
import FAQ from '@/components/client/FAQ/FAQ'

import ToTheTop from '@/components/client/ui/to-the-top'

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
      <JoinUs />
      <FAQ />
      <ToTheTop />
    </div>
  )
}
