import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import ProductJsonLd from '@/components/client/json-ld/product-json-ld'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import { ProductInfo } from '@/components/client/product-page/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import ToTheTop from '@/components/ui/to-the-top'
import { getTranslations } from 'next-intl/server'
import { Loader } from 'lucide-react'
import ProductSlider from '@/components/client/product-slider'
import { SITE_URL } from '@/data/contacts'
import {
  getPublicProduct,
  getPublicProductRecommendations,
} from '@/server/public-data-cache.server'
import { getCanonicalProductCategorySlug } from '@/utils/product-category'

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

type ProductCategoryData = {
  _id: string
  name: string
  slug: string
  parentCategory?: string | null
}

type ProductPageData = Omit<IProduct, 'categories'> & {
  categories: ProductCategoryData[]
  img: string
  title: string
  metaDescription: string
}

const getProductData = async (slug: string, locale: ILocale) => {
  const result = await getPublicProduct(slug.toLowerCase(), locale)
  if (!result.success || Array.isArray(result.data)) return null

  return result.data as unknown as ProductPageData
}

const appendSearchParams = (
  pathname: string,
  searchParams: Record<string, string | string[] | undefined>,
) => {
  const query = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item))
    else if (value !== undefined) query.set(key, value)
  })

  const queryString = query.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale, category } = await params
  const normalizedSlug = slug.toLowerCase()
  const normalizedCategory = category.toLowerCase()
  const productData = await getProductData(normalizedSlug, locale)

  if (!productData) notFound()

  const assignedCategorySlugs = new Set(
    productData.categories.map(({ slug: categorySlug }) =>
      categorySlug.toLowerCase(),
    ),
  )
  if (!assignedCategorySlugs.has(normalizedCategory)) notFound()

  const canonicalCategory = getCanonicalProductCategorySlug(
    productData.categories,
  )
  if (!canonicalCategory) notFound()

  const canonicalPath = `products/${canonicalCategory}/product/${normalizedSlug}`
  const canonicalUrl = `${SITE_URL}/${locale}/${canonicalPath}`

  return {
    title: productData.title,
    description: productData.metaDescription,
    keywords: getProductKeywords(productData.keywords),
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/${canonicalPath}`,
        uk: `${SITE_URL}/uk/${canonicalPath}`,
        'x-default': `${SITE_URL}/uk/${canonicalPath}`,
      },
    },
    openGraph: {
      title: productData.title,
      description: productData.metaDescription,
      url: canonicalUrl,
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: productData.img,
          alt: productData.name,
        },
      ],
      siteName: "Slice & Dry's",
    },
    twitter: {
      card: 'summary_large_image',
      title: productData.title,
      description: productData.metaDescription,
      images: [productData.img],
    },
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug, locale, category } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const normalizedSlug = slug.toLowerCase()
  const normalizedCategory = category.toLowerCase()
  const t = await getTranslations('product')
  const productData = await getProductData(normalizedSlug, locale)

  if (!productData) notFound()

  const assignedCategorySlugs = new Set(
    productData.categories.map(({ slug: categorySlug }) =>
      categorySlug.toLowerCase(),
    ),
  )
  if (!assignedCategorySlugs.has(normalizedCategory)) notFound()

  const canonicalCategorySlug = getCanonicalProductCategorySlug(
    productData.categories,
  )
  if (!canonicalCategorySlug) notFound()

  const canonicalPath = `/${locale}/products/${canonicalCategorySlug}/product/${normalizedSlug}`

  if (
    slug !== normalizedSlug ||
    category !== normalizedCategory ||
    normalizedCategory !== canonicalCategorySlug
  ) {
    permanentRedirect(appendSearchParams(canonicalPath, resolvedSearchParams))
  }

  const productSliderData = await getPublicProductRecommendations(
    locale,
    normalizedSlug,
  )
  const canonicalUrl = `${SITE_URL}${canonicalPath}`
  const canonicalCategory =
    productData.categories.find(
      ({ slug: categorySlug }) =>
        categorySlug.toLowerCase() === canonicalCategorySlug,
    ) ?? productData.categories[0]

  return (
    <>
      <ProductJsonLd
        productData={productData as unknown as IProduct}
        canonicalUrl={canonicalUrl}
        categoryName={canonicalCategory.name}
        categoryUrl={`${SITE_URL}/${locale}/products/${canonicalCategorySlug}`}
      />
      <div className="mx-auto max-w-[1280px] px-4">
        <Breadcrumbs
          locale={locale}
          category={canonicalCategory.name}
          product={productData.name}
          categoryLink={`products/${canonicalCategorySlug}`}
        />
        <ProductInfo product={productData as unknown as IProduct} />
        <Accordions
          nutrition={productData.nutritionalValue}
          description={productData.description}
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
