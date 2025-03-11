import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Hero } from '@/components/client/main/hero'
import ProductSlider from '@/components/client/product-slider/product-slider'
import { detectDevice } from '@/utils/deviceDetection'
import { faqData } from '@/data/main/faq'
import type { Metadata } from 'next'
import { mainMetaData } from '@/data/meta-data/main'
import { locales } from '@/data/locales'
import MainJsonLd from '@/components/client/json-ld/main-json-ld'
import { reviewsData } from '@/data/main/reviews'
import { fetchTags } from '@/data/fetch-tags'
import Help from '@/components/client/main/help/help'
import Faq from '@/components/client/main/faq/faq'
import Partners from '@/components/client/main/partners'
import { partnersData } from '@/data/main/partners'
import BlogSection from '@/components/client/main/blog/blog'

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

  const [productsData, categoriesData, helpData, blogData] = await Promise.all([
    fetch(`${url}/api/products/get-products-slider-main?locale=${locale}`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.products}`] },
    }).then((res) => res.json()),

    await fetch(`${url}/api/categories`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.menu}`] },
    }).then((res) => res.json()),

    await fetch(`${url}/api/block/help?locale=${locale}`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.helpMain}`] },
    }).then((res) => res.json()),

    fetch(`${url}/api/posts?locale=${locale}&page=1&limit=5`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.posts}`] },
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
      <Help data={helpData.data} />
      <Faq data={faqData[locale]} />
      <Partners data={partnersData[locale]} />
      <BlogSection data={blogData.postsLocalized} />
    </>
  )
}

/*

 const [productsData, blogData, categoriesData, helpData] = await Promise.all([
    fetch(`${url}/api/products/get-products-slider-main?locale=${locale}`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.products}`] },
    }).then((res) => res.json()),

    fetch(`${url}/api/posts?locale=${locale}&page=1&limit=5`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.posts}`] },
    }).then((res) => res.json()),

    await fetch(`${url}/api/categories`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.menu}`] },
    }).then((res) => res.json()),

    await fetch(`${url}/api/block/help?locale=${locale}`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.helpMain}`] },
    }).then((res) => res.json()),
  ])





      <Reviews reviews={reviewsData} />
      <InstaFeed data={instaData[locale]} />
      <ToTheTop />
 */
