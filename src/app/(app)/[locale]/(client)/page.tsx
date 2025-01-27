import { Hero } from '@/components/client/main/hero/hero'
import ProductSlider from '@/components/client/slider/productSlider'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'
import Faq from '@/components/client/main/faq/faq'
import AboutUa from '@/components/client/main/about-ua'
import Help from '@/components/client/main/help'
import IncreaseWithUs from '@/components/client/main/increase-with-us'
import Reviews from '@/components/client/main/reviews'
import Partner from '@/components/client/main/partner'
import MoreAboutUs from '@/components/client/main/more-about-us'
import { faqData } from '@/data/main/faq'

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
      <Faq data={faqData[locale]} />
      <AboutUa />
      <Help />
      <IncreaseWithUs />
      <Reviews />
      <Partner />
      <MoreAboutUs />
    </div>
  )
}
