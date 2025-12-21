import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Loader } from 'lucide-react'
import { locales } from '@/data/locales'
import ProductJsonLd from '@/components/client/json-ld/product-json-ld'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import { ProductInfo } from '@/components/client/product-page/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import ToTheTop from '@/components/ui/to-the-top'
import ProductSlider from '@/components/client/product-slider'
import { productsDataUk } from '@/data/prodcuts/productDataUk'
import { productsDataEn } from '@/data/prodcuts/productDataEn'
import { pickRandom } from '@/utils/pickRandom'
import NotFoundPage from '@/components/not-found'
import { categorySlugUk } from '@/data/prodcuts/categorySlugUk'
import { categorySlugEn } from '@/data/prodcuts/categorySlugEn'

export const revalidate = 86400

const Delivery = dynamic(
  () => import('@/components/client/promo-banner/delivery'),
  { loading: () => <Loader /> },
)

type Props = {
  params: Promise<{ locale: ILocale; slug: string }>
}

const SITE_URL = process.env.NEXT_URL

function requireSiteUrl() {
  if (!SITE_URL) throw new Error('NEXT_URL is not set')
  return SITE_URL
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params

  let product
  if (locale === 'uk') {
    product = productsDataUk.find((item) => item.slug === slug)
  }
  if (locale === 'en') {
    product = productsDataEn.find((item) => item.slug === slug)
  }

  if (!product) {
    return {
      title: '404',
      description: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
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
  const categorySlugByLocale = {
    uk: categorySlugUk,
    en: categorySlugEn,
  } as const

  const productSlugByLocale = {
    uk: productsDataUk.map((p) => ({ slug: p.slug })),
    en: productsDataEn.map((p) => ({ slug: p.slug })),
  } as const

  return locales.flatMap((locale) =>
    productSlugByLocale[locale as 'uk' | 'en'].flatMap((item) =>
      categorySlugByLocale[locale as 'uk' | 'en'].data.map(
        (category: { slug: string }) => ({
          slug: item.slug,
          locale,
          menu: category.slug,
        }),
      ),
    ),
  )
}

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params
  const t = await getTranslations('product')

  const data = locale === 'uk' ? productsDataUk : productsDataEn

  const resultProduct = data.find((item) => item.slug === slug)
  if (!resultProduct) return <NotFoundPage />

  const categorySlug = resultProduct.categories?.[0]?.slug ?? ''
  const resultSlider = pickRandom(data, 6)

  const canonicalUrl = `${requireSiteUrl()}/${locale}/${categorySlug}/${slug}`

  return (
    <>
      <ProductJsonLd productData={resultProduct} canonicalUrl={canonicalUrl} />
      <div className="mx-auto max-w-[1280px] px-4">
        <Breadcrumbs
          locale={locale}
          category={resultProduct.categories?.[0]?.name}
          product={resultProduct.name}
          categoryLink={resultProduct.categories?.[0]?.slug}
        />
        <ProductInfo product={resultProduct} />
        <Accordions
          nutrition={resultProduct.nutritionalValue}
          description={resultProduct.description}
        />
        <ProductSlider
          products={resultSlider}
          title={t('also-buy')}
          message={t('something-that-will-come-handy-along-with-your-choice')}
        />
        <Delivery className="mt-[330px] mb-[200px]" />
        <ToTheTop />
      </div>
    </>
  )
}
