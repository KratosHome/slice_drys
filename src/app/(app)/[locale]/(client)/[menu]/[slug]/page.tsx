import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Loader } from 'lucide-react'

import { getProductsUrls } from '@/server/products/get-products-urls.server'
import { getCategoryUrls } from '@/server/categories/get-category-urls.server'
import { locales } from '@/data/locales'
import ProductJsonLd from '@/components/client/json-ld/product-json-ld'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import { ProductInfo } from '@/components/client/product-page/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import ToTheTop from '@/components/ui/to-the-top'
import ProductSlider from '@/components/client/product-slider'
import { revalidateDay } from '@/constants/revalidate'

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

const SITE_URL = process.env.NEXT_URL

function requireSiteUrl() {
  if (!SITE_URL) throw new Error('NEXT_URL is not set')
  return SITE_URL
}

async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<{ res: Response; json: T }> {
  const res = await fetch(url, init)
  const json = (await res.json()) as T
  return { res, json }
}

type ProductApiResponse =
  | { success: true; data: any }
  | { success: false; message?: string }

async function getProduct(slug: string, locale: ILocale) {
  const baseUrl = requireSiteUrl()
  const url = new URL('/api/products/get-by-slug', baseUrl)
  url.searchParams.set('slug', slug)
  url.searchParams.set('locale', locale)

  const { res, json } = await fetchJson<ProductApiResponse>(url.toString(), {
    next: {
      revalidate: revalidateDay,
      tags: [`product:${locale}:${slug}`],
    },
  })

  if (res.status === 404) return null

  if (!res.ok) {
    throw new Error(`getProduct failed: ${res.status} ${res.statusText}`)
  }

  if (!json || json.success !== true) {
    throw new Error('getProduct returned success:false (treating as 500)')
  }

  return json.data
}

type SliderApiResponse = { success: true; data: any[] } | { success: false }

async function getSlider(slug: string, locale: ILocale) {
  const baseUrl = requireSiteUrl()
  const url = new URL('/api/products/get-products-slider-product', baseUrl)
  url.searchParams.set('locale', locale)
  url.searchParams.set('productSlug', slug)

  const { res, json } = await fetchJson<SliderApiResponse>(url.toString(), {
    next: {
      revalidate: revalidateDay,
      tags: [`product-slider:${locale}:${slug}`],
    },
  })

  if (!res.ok)
    throw new Error(`getSlider failed: ${res.status} ${res.statusText}`)
  if (!json || json.success !== true) return []

  return json.data
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params

  const product = await getProduct(slug, locale).catch(() => null)
  if (!product) {
    return {
      title: '404',
      description: '404',
      keywords: ['404'],
      robots: 'noindex, nofollow',
    }
  }

  const categorySlug = product.categories?.[0]?.slug ?? ''
  const canonicalUrl = `${requireSiteUrl()}/${locale}/${categorySlug}/${slug}`

  return {
    title: product.title,
    description: product.metaDescription,
    keywords: String(product.keywords?.[0] ?? '')
      .split(',')
      .map((w: string) => w.trim())
      .filter(Boolean),
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        uk: canonicalUrl,
      },
    },
    openGraph: {
      title: product.title,
      description: product.metaDescription,
      url: canonicalUrl,
      images: [
        {
          url: product.img,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: 'SliceDrys',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.metaDescription,
      images: [product.img],
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

  const [product, slider] = await Promise.all([
    getProduct(slug, locale),
    getSlider(slug, locale),
  ])

  if (!product) notFound()

  const categorySlug = product.categories?.[0]?.slug ?? ''
  const canonicalUrl = `${requireSiteUrl()}/${locale}/${categorySlug}/${slug}`

  return (
    <>
      <ProductJsonLd productData={product} canonicalUrl={canonicalUrl} />
      <div className="mx-auto max-w-[1280px] px-4">
        <Breadcrumbs
          locale={locale}
          category={product.categories?.[0]?.name}
          product={product.name}
          categoryLink={product.categories?.[0]?.slug}
        />
        <ProductInfo product={product} />
        <Accordions
          nutrition={product.nutritionalValue}
          description={product.description}
        />
        <ProductSlider
          products={slider}
          title={t('also-buy')}
          message={t('something-that-will-come-handy-along-with-your-choice')}
        />
        <Delivery className="mt-[330px] mb-[200px]" />
        <ToTheTop />
      </div>
    </>
  )
}
