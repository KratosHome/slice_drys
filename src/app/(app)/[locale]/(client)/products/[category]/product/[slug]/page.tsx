import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
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
  params: Promise<{ locale: ILocale; category: string; slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const getRequestOrigin = async () => {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http'

  return host ? `${protocol}://${host}` : SITE_URL
}

const getProductData = async (slug: string, locale: ILocale) => {
  const apiOrigin = await getRequestOrigin()

  return fetch(
    `${apiOrigin}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
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
}

const getProductKeywords = (keywords?: string | string[]) => {
  const value = Array.isArray(keywords) ? keywords.join(',') : keywords

  return (
    value
      ?.split(',')
      .map((word) => word.trim())
      .filter(Boolean) || []
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug, locale, category } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const hasQueryParams = Object.keys(resolvedSearchParams).length > 0
  const productData = await getProductData(slug, locale)

  if (!productData) {
    return {
      title: '404',
      description: '404',
      keywords: ['404'],
      robots: 'noindex, nofollow',
    }
  }

  const canonicalUrl = `${SITE_URL}/${locale}/products/${category.toLowerCase()}/product/${slug.toLowerCase()}`

  if (hasQueryParams) {
    return {
      title: productData.data.title,
      description: productData.data.metaDescription,
      keywords: getProductKeywords(productData.data.keywords),
      robots: 'noindex, nofollow',
      openGraph: {
        title: productData.data.title,
        description: productData.data.metaDescription,
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

  return {
    title: productData.data.title,
    description: productData.data.metaDescription,
    keywords: getProductKeywords(productData.data.keywords),
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/products/${category}/product/${slug}`,
        uk: `${SITE_URL}/uk/products/${category}/product/${slug}`,
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

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug, locale, category } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const hasQueryParams = Object.keys(resolvedSearchParams).length > 0
  const t = await getTranslations('product')
  const apiOrigin = await getRequestOrigin()

  const [productData, productSliderData] = await Promise.all([
    getProductData(slug, locale),
    fetch(
      `${apiOrigin}/api/products/get-products-slider-product?&locale=${locale}&productSlug=${slug}`,
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

  const productCategorySlug = productData.data.categories[0].slug
  const canonicalUrl = `${SITE_URL}/${locale}/products/${category}/product/${slug}`

  return (
    <>
      {!hasQueryParams ? (
        <ProductJsonLd
          productData={productData.data}
          canonicalUrl={canonicalUrl}
        />
      ) : null}
      <div className="mx-auto max-w-[1280px] px-4">
        <Breadcrumbs
          locale={locale}
          category={productData.data.categories[0].name}
          product={productData.data.name}
          categoryLink={`products/${productCategorySlug}`}
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
