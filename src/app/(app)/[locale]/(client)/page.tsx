import type { Metadata } from 'next'

import { mainMetaData } from '@/data/meta-data/main'
import { locales } from '@/data/locales'
import { instaData } from '@/data/main/insta-data'

import Hero from '@/components/client/main/hero'
import BlogSection from '@/components/client/main/blog'
import InstaFeed from '@/components/client/main/insta-feed'
import MainJsonLd from '@/components/client/json-ld/main-json-ld'
import ToTheTop from '@/components/ui/to-the-top'
import ProductSlider from '@/components/client/product-slider'

import { getTranslations } from 'next-intl/server'
import {
  getPublicCategories,
  getPublicMainProducts,
  getPublicPosts,
} from '@/server/public-data-cache.server'
import { toPlainObject } from '@/utils/to-plain-object'

export const revalidate = 86400

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
  const { locale } = await props.params

  const t = await getTranslations('main')

  const [productsData, categoriesData, blogData] = await Promise.all([
    getPublicMainProducts(locale),
    getPublicCategories(),
    getPublicPosts(locale, 1, 5),
  ])
  const products = toPlainObject(productsData.products)
  const productLinks: IPublicCategoryLink[] = categoriesData.data.map(
    ({ slug, name }) => ({ slug, name }),
  )
  const posts = toPlainObject(blogData.postsLocalized ?? [])

  return (
    <>
      <MainJsonLd products={products} />
      <Hero productLinks={productLinks} />
      <ProductSlider
        products={products}
        title={t('products-slider.title')}
        message={t('products-slider.message')}
      />
      <BlogSection data={posts} />
      <InstaFeed title={t('instafeed.title')} data={instaData[locale]} />
      <ToTheTop />
    </>
  )
}
