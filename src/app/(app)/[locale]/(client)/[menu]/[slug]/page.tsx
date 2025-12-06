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
import ProductSlider from '@/components/client/product-slider'
import { revalidateDay } from '@/constants/revalidate'

const Delivery = dynamic(
  () => import('@/components/client/promo-banner/delivery'),
  {
    loading: () => <Loader />,
  },
)

type Props = {
  params: Promise<{ locale: ILocale; slug: string }>
}

const baseUrl = process.env.NEXT_URL

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params

  const productData = await fetch(
    `${baseUrl}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
    {
      cache: 'force-cache',
      next: { revalidate: revalidateDay, tags: [`${fetchTags.product}`] },
    },
  ).then((res) => res.json())

  if (productData.success === false) {
    return {
      title: '404',
      description: '404',
      keywords: ['404'],
      robots: 'noindex, nofollow',
    }
  }

  const categorySlug = productData.data.categories[0].slug

  const canonicalUrl = `${baseUrl}/${locale}/${categorySlug}/${slug}`

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
        en: `${canonicalUrl}`,
        uk: `${canonicalUrl}`,
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
      `${baseUrl}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
      {
        cache: 'force-cache',
        next: { revalidate: revalidateDay, tags: [`${fetchTags.product}`] },
      },
    ).then((res) => res.json()),

    fetch(
      `${baseUrl}/api/products/get-products-slider-product?&locale=${locale}&productSlug=${slug}`,
      {
        cache: 'force-cache',
        next: { revalidate: revalidateDay, tags: [`${fetchTags.product}`] },
      },
    ).then((res) => res.json()),
  ])

  if (productData.success === false) {
    return <NotFoundPage />
  }

  const categorySlug = productData.data.categories[0].slug
  const canonicalUrl = `${baseUrl}/${locale}/${categorySlug}/${slug}`

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
          products={productSliderData.data}
          title={t('also-buy')}
          message={t('something-that-will-come-handy-along-with-your-choice')}
        />
        <Delivery className="mt-[330px] mb-[200px]" />
        <ToTheTop />
      </div>
    </>
  )
}

/*
export async function generateStaticParams() {
  const [productSlug, categorySlug] = await Promise.all([
    getProductsUrls(),
    getCategoryUrls(),
  ])

  const limitedProducts = productSlug.data.slice(0, 1)
  const limitedCategories = categorySlug.data.slice(0, 1)

  return limitedProducts.flatMap((item: { slug: string }) =>
    limitedCategories.flatMap((category: { slug: string }) =>
      locales.map((locale) => ({
        slug: item.slug,
        locale,
        menu: category.slug,
      })),
    ),
  )
}
 */
