import { ProductInfo } from '@/components/client/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import NotFoundPage from '@/components/not-found'
import ProductSlider from '@/components/client/product-slider/product-slider'
import { getTranslations } from 'next-intl/server'
import Delivery from '@/components/client/promo-banner/delivery'
import ToTheTop from '@/components/client/ui/to-the-top'
import type { Metadata } from 'next'
import ProductJsonLd from '@/components/client/json-ld/product-json-ld'
import { getProductsUrls } from '@/server/products/get-products-urls.server'
import { locales } from '@/data/locales'
import { getCategoryUrls } from '@/server/categories/get-category-urls.server'

type Params = Promise<{ locale: ILocale; slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const baseUrl = process.env.NEXT_URL

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug, locale } = await params

  const productData = await fetch(
    `${baseUrl}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
    {},
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
  const productSlug = await getProductsUrls()
  const categorySlug = await getCategoryUrls()

  return productSlug.data.flatMap((item: { slug: string }) =>
    categorySlug.data.flatMap((category: { slug: string }) =>
      locales.map((locale) => ({
        slug: item.slug,
        locale,
        category: category.slug,
      })),
    ),
  )
}

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug, locale } = await props.params

  const t = await getTranslations('product')

  const [productData, productSliderData] = await Promise.all([
    fetch(
      `${baseUrl}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`,
      { next: { revalidate: 60 } },
    ).then((res) => res.json()),

    fetch(
      `${baseUrl}/api/products/get-products-slider-product?&locale=${locale}&productSlug=${slug}`,
      { next: { revalidate: 60 } },
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
      <div className="container px-5">
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
          title={t('also_buy')}
          message={t('something_that_will_come_handy_along_with_your_choice')}
        />
        <Delivery />
        <ToTheTop />
      </div>
    </>
  )
}

/*
export async function generateStaticParams() {
  const productSlug = await getProductsUrls()

  return productSlug.data.flatMap((item: { slug: string }) =>
    locales.map((locale) => ({
      slug: item.slug,
      locale,
    })),
  )
}

 */
