import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'

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
import type { Metadata } from 'next'
import { mainMetaData } from '@/data/meta-data/main'
import { locales } from '@/data/locales'
import MainJsonLd from '@/components/client/json-ld/main-json-ld'
import { reviewsData } from '@/data/main/reviews'
import { instaData } from '@/data/main/insta-data'

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale } = await params

  return mainMetaData[locale]
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function Home(props: {
  params: Params
  searchParams: ISearchParams
}) {
  const url = process.env.NEXT_URL
  const { locale } = await props.params
  const t = await getTranslations('main.products-slider')
  const userAgent: string = (await headers()).get('user-agent') || ''
  const device: IDevice = detectDevice(userAgent)

  const [productsData, blogData, categoriesData] = await Promise.all([
    fetch(`${url}/api/products/get-products-slider-main?locale=${locale}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    fetch(`${url}/api/posts?locale=${locale}&page=1&limit=5`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    await fetch(`${url}/api/categories`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
  ])

  return (
    <>
      <MainJsonLd
        products={productsData.products}
        faq={faqData[locale]}
        reviews={reviewsData}
      />
      <Hero device={device} productLinks={categoriesData.data} />
      <ProductSlider
        products={productsData.products}
        title={t('title')}
        message={t('message')}
      />
      <Help data={helpData[locale]} />
      <Faq data={faqData[locale]} />
      <Partners data={partnersData[locale]} />
      <BlogSection data={blogData.postsLocalized} />
      <Reviews reviews={reviewsData} />
      <InstaFeed data={instaData[locale]} />
      <ToTheTop />
    </>
  )
}
