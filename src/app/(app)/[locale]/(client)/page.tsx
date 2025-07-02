import type { Metadata } from 'next'

import { faqData } from '@/data/main/faq'
import { mainMetaData } from '@/data/meta-data/main'
import { locales } from '@/data/locales'
import { fetchTags } from '@/data/fetch-tags'
import { instaData } from '@/data/main/insta-data'
import { reviewsData } from '@/data/main/reviews'

import Hero from '@/components/client/main/hero'
import Faq from '@/components/client/main/faq'
import BlogSection from '@/components/client/main/blog'
import Reviews from '@/components/client/main/reviews'
import InstaFeed from '@/components/client/main/insta-feed'
import MainJsonLd from '@/components/client/json-ld/main-json-ld'
import ToTheTop from '@/components/ui/to-the-top'
import ProductSlider from '@/components/client/product-slider'

import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { detectDevice } from '@/utils/device-detection'

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

export default async function HomePage(props: {
  params: Params
  searchParams: ISearchParams
}) {
  const SITE_URL: string | undefined = process.env.NEXT_URL

  const { locale } = await props.params

  const t = await getTranslations('main')

  const userAgent: string = (await headers()).get('user-agent') || ''
  const device: IDevice = detectDevice(userAgent)

  const [productsData, categoriesData, blogData] = await Promise.all([
    fetch(
      `${SITE_URL}/api/products/get-products-slider-main?locale=${locale}`,
      {
        cache: 'force-cache',
        next: { tags: [`${fetchTags.products}`] },
      },
    ).then((res) => res.json()),

    fetch(`${SITE_URL}/api/categories`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.menu}`] },
    }).then((res) => res.json()),

    fetch(`${SITE_URL}/api/posts?locale=${locale}&page=1&limit=5`, {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.posts}`] },
    }).then((res) => res.json()),
  ])

  return (
    <>
      <MainJsonLd
        products={productsData.products}
        faq={faqData[locale]}
        reviews={reviewsData.map((review) => ({
          ...review,
          author: review.author[locale],
          text: review.text[locale],
        }))}
      />
      <Hero device={device} productLinks={categoriesData.data} />
      <ProductSlider
        products={productsData.products}
        title={t('products-slider.title')}
        message={t('products-slider.message')}
      />
      <Faq data={faqData[locale]} />
      <BlogSection data={blogData.postsLocalized} />
      <Reviews
        reviews={reviewsData.map((review) => ({
          ...review,
          author: review.author[locale],
          text: review.text[locale],
        }))}
      />
      <InstaFeed title={t('instafeed.title')} data={instaData[locale]} />
      <ToTheTop />
    </>
  )
}
