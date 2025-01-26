import { Hero } from '@/components/client/hero/hero'
import ProductSlider from '@/components/client/slider/productSlider'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'
import { headers } from 'next/headers'
import { detectDevice } from '@/utils/deviceDetection'

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
    </div>
  )
}
