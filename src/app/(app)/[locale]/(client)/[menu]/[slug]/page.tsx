import dynamic from 'next/dynamic'

export const dynamicParams = true
import { getProductsUrls } from '@/server/products/get-products-urls.server'
import { locales } from '@/data/locales'
import { getCategoryUrls } from '@/server/categories/get-category-urls.server'
import { Metadata } from 'next'
import NotFoundPage from '@/components/not-found'
import ProductJsonLd from '@/components/client/json-ld/product-json-ld'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import { ProductInfo } from '@/components/client/product-page/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import ToTheTop from '@/components/ui/to-the-top'
import { getTranslations } from 'next-intl/server'
import { fetchTags } from '@/data/fetch-tags'
import { Loader } from 'lucide-react'
import ProductSlider from '@/components/client/product-slider/product-slider'
import { SITE_URL } from '@/data/contacts'

export const revalidate = 86400

const Delivery = dynamic(
  () => import('@/components/client/promo-banner/delivery'),
  {
    loading: () => <Loader />,
  },
)

type Props = {
  params: Promise<{ locale: ILocale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params

  const productData = await fetch(
    `${SITE_URL}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
    {
      cache: 'no-store',
      next: { tags: [fetchTags.product] },
    },
  ).then(async (res) => {
    if (!res.ok) return null
    const data = await res.json()
    if (data?.success === false) return null
    return data
  })

  if (!productData) {
    return {
      title: '404',
      description: '404',
      keywords: ['404'],
      robots: 'noindex, nofollow',
    }
  }

  const categorySlug = productData.data.categories[0].slug

  const canonicalUrl = `${SITE_URL}/${locale}/${categorySlug.toLowerCase()}/${slug.toLowerCase()}`

  return {
    title: productData.data.title,
    description: productData.data.metaDescription,
    keywords: productData.data.keywords[0]
      .split(',')
      .map((word: string) => word.trim()),
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/${categorySlug}/${slug}`,
        uk: `${SITE_URL}/uk/${categorySlug}/${slug}`,
      },
    },
    openGraph: {
      title: productData.data.title,
      description: productData.data.metaDescription,
      url: canonicalUrl,
      images: [
        {
          url: productData.data.img,
          width: 1200,
          height: 630,
          alt: productData.data.name,
        },
      ],
      siteName: 'SliceDrys',
    },
    twitter: {
      card: 'summary_large_image',
      title: productData.data.title,
      description: productData.data.metaDescription,
      images: [productData.data.img],
    },
  }
}

export async function generateStaticParams() {
  const [productSlug, categorySlug] = await Promise.all([
    getProductsUrls(),
    getCategoryUrls(),
  ])

  return productSlug.data.flatMap((item: { slug: string }) =>
    categorySlug.data.flatMap((category: { slug: string }) =>
      locales.map((locale) => ({
        slug: item.slug,
        locale,
        menu: category.slug,
      })),
    ),
  )
}

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params

  const t = await getTranslations('product')

  const [productData, productSliderData] = await Promise.all([
    fetch(
      `${SITE_URL}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
      {
        cache: 'no-store',
        next: { tags: [`${fetchTags.product}`] },
      },
    ).then(async (res) => {
      if (!res.ok) return null
      const data = await res.json()
      if (data?.success === false) return null
      return data
    }),

    fetch(
      `${SITE_URL}/api/products/get-products-slider-product?&locale=${locale}&productSlug=${slug}`,
      {
        cache: 'no-store',
        next: { tags: [`${fetchTags.product}`] },
      },
    ).then(async (res) => {
      if (!res.ok) return null
      const data = await res.json()
      if (data?.success === false) return null
      return data
    }),
  ])

  if (!productData) {
    return <NotFoundPage />
  }

  const categorySlug = productData.data.categories[0].slug
  const canonicalUrl = `${SITE_URL}/${locale}/${categorySlug}/${slug}`

  return (
    <>
      <ProductJsonLd
        productData={productData.data}
        canonicalUrl={canonicalUrl}
      />
      <div className="mx-auto max-w-[1280px] px-4">
        <Breadcrumbs
          locale={locale}
          category={productData.data.categories[0].name}
          product={productData.data.name}
          categoryLink={productData.data.categories[0].slug}
        />
        <ProductInfo product={productData.data} />
        <Accordions
          nutrition={productData.data.nutritionalValue}
          description={productData.data.description}
        />
        <ProductSlider
          products={productSliderData?.data}
          title={t('also-buy')}
          message={t('something-that-will-come-handy-along-with-your-choice')}
        />
        <Delivery className="mt-[330px] mb-[200px]" />
        <ToTheTop />
      </div>
    </>
  )
}
