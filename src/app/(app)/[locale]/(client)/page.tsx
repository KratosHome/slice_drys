import { Hero } from '@/components/client/main/hero/hero'
import ProductSlider from '@/components/client/product-slider/product-slider'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'
import { headers } from 'next/headers'
import { detectDevice } from '@/utils/deviceDetection'
import Faq from '@/components/client/main/faq/faq'
import AboutUa from '@/components/client/main/about-ua'
import Help from '@/components/client/main/help/help'
import Reviews from '@/components/client/main/reviews/reviews'
import Partners from '@/components/client/main/partners'
import MoreAboutUs from '@/components/client/main/more-about-us'
import { faqData } from '@/data/main/faq'
import { helpData } from '@/data/main/help'
import ToTheTop from '@/components/client/ui/to-the-top'
import { partnersData } from '@/data/main/partners'

export default async function Home(props: {
  params: Params
  searchParams: ISearchParams
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}) {
  const { locale } = await props.params
  const userAgent = (await headers()).get('user-agent') || ''
  const device = detectDevice(userAgent)

  const productsData: IGetProducts = await getProductsSliderMain(locale)

  return (
    <div>
      <Hero device={device} />
      <ProductSlider
        title={'ТОПОВІ СУШЕНИКИ'}
        message={'найсмачніші кусь-топчики'}
        products={productsData.products}
      />
      <Help data={helpData[locale]} />
      <Faq data={faqData[locale]} />
      <Partners data={partnersData[locale]} />
    </div>
  )
}

/*
      <AboutUa />
      <Help data={helpData[locale]} />
      <Reviews />
      <Partners />
      <MoreAboutUs />
      <ToTheTop />
 */
