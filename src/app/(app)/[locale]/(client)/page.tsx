import { headers } from 'next/headers'

import { Hero } from '@/components/client/main/hero'
import ProductSlider from '@/components/client/product-slider/product-slider'
import { detectDevice } from '@/utils/deviceDetection'
import Faq from '@/components/client/main/faq/faq'
import InstaFeed from '@/components/client/main/instaFeed/InstaFeed'
import Help from '@/components/client/main/help/help'
import Reviews from '@/components/client/main/reviews/reviews'
import Partners from '@/components/client/main/partners'
import BlogSection from '@/components/client/main/blog/blog'
import ToTheTop from '@/components/client/ui/to-the-top'

import { partnersData } from '@/data/main/partners'
import { faqData } from '@/data/main/faq'
import { helpData } from '@/data/main/help'

export default async function Home(props: {
  params: Params
  searchParams: ISearchParams
}) {
  const url = process.env.NEXT_URL
  const { locale } = await props.params
  const userAgent: string = (await headers()).get('user-agent') || ''
  const device: IDevice = detectDevice(userAgent)

  const [productsData, blogData, instaPosts] = await Promise.all([
    fetch(`${url}/api/products/get-products-slider-main?locale=${locale}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    fetch(`${url}/api/post?locale=${locale}&page=1&limit=12`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    fetch(`${url}/api/instagram?limit=6`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
  ])

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
      <BlogSection data={blogData.post} />
      <Reviews />
      <InstaFeed data={instaPosts} />
      <ToTheTop />
    </div>
  )
}
