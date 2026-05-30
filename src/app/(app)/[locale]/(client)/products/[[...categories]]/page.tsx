import React from 'react'
import Product from '@/components/client/product'
import ProductFilters from '@/components/client/product-filters/product-filters'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs'
import ToTheTop from '@/components/ui/to-the-top'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getProductBgImg } from '@/data/product-bg-img'
import ProductListJsonLd from '@/components/client/json-ld/product-list-json-ld'
import Delivery from '@/components/client/promo-banner/delivery'
import { getPaginationRange } from '@/utils/get-pagination-range'
import NotFoundPage from '@/components/not-found'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import 'quill/dist/quill.snow.css'
import { SITE_URL } from '@/data/contacts'
import { fetchTags } from '@/data/fetch-tags'

export const revalidate = 86400

type Params = Promise<{ locale: ILocale; categories?: string[] }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const getCategoryPath = (categories?: string[]) =>
  (categories ?? []).map((category) => category.toLowerCase())

const getRequestOrigin = async () => {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http'

  return host ? `${protocol}://${host}` : SITE_URL
}

const getSelectedCategories = (
  pathCategories: string[],
  categories?: string | string[],
) => {
  if (Array.isArray(categories)) return categories

  if (categories) {
    return categories
      .split(',')
      .map((category) => category.trim())
      .filter(Boolean)
  }

  return pathCategories.slice(1)
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const getCategoryDescriptionHtml = (description?: string) => {
  if (!description) return ''

  try {
    const content = JSON.parse(description)
    const converter = new QuillDeltaToHtmlConverter(content.ops ?? [])
    return converter.convert()
  } catch {
    return `<p>${escapeHtml(description)}</p>`
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}): Promise<Metadata> {
  const { locale, categories } = await params
  const resolvedSearchParams = await searchParams
  const { categories: queryCategories } = resolvedSearchParams
  const categoryPath = getCategoryPath(categories)
  const rootCategorySlug = categoryPath[0]
  const hasQueryParams = Object.keys(resolvedSearchParams).length > 0

  if (!rootCategorySlug) {
    return {
      title: 'categories not found',
      description: 'categories not found',
      robots: 'noindex, nofollow',
    }
  }

  const selectedCategories = getSelectedCategories(
    categoryPath,
    queryCategories,
  )
  const currentCategorySlug =
    selectedCategories.length === 1 ? selectedCategories[0] : rootCategorySlug
  const apiOrigin = await getRequestOrigin()
  const currentCategories = await fetch(
    `${apiOrigin}/api/products/current-categories?&slug=${currentCategorySlug}`,
    {
      cache: 'no-store',
      next: { tags: [`${fetchTags.products}`] },
    },
  ).then(async (res) => {
    if (!res.ok) return null
    const data = await res.json()
    if (data?.success === false) return null
    return data
  })

  if (!currentCategories?.data) {
    return {
      title: 'categories not found',
      description: 'categories not found',
      robots: 'noindex, nofollow',
    }
  }

  const currentCategory = currentCategories.data as unknown as ICategory
  const noIndexMetadata = {
    title: currentCategory.metaTitle?.[locale],
    description: currentCategory.metaDescription?.[locale] || '',
    keywords:
      currentCategory.metaKeywords?.[locale]
        ?.split(',')
        .map((keyword: string) => keyword.trim()) || [],
    robots: 'noindex, nofollow',
    openGraph: {
      title: currentCategory.name?.[locale],
      description: currentCategory.metaDescription?.[locale] || '',
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      images: [
        {
          url: currentCategory.image || '',
          width: 1200,
          height: 630,
          alt: currentCategory.metaTitle?.[locale],
        },
      ],
    },
  } satisfies Metadata

  if (hasQueryParams) return noIndexMetadata

  const canonicalPath =
    selectedCategories.length === 1
      ? `products/${rootCategorySlug}/${selectedCategories[0]}`
      : `products/${rootCategorySlug}`
  const canonicalUrl = `${SITE_URL}/${locale}/${canonicalPath}`
  const description = currentCategory.metaDescription?.[locale] || ''
  const metaKeywordsArray =
    currentCategory.metaKeywords?.[locale]
      ?.split(',')
      .map((keyword: string) => keyword.trim()) || []

  return {
    title: currentCategory.metaTitle?.[locale],
    description,
    keywords: metaKeywordsArray,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/${canonicalPath}`,
        uk: `${SITE_URL}/uk/${canonicalPath}`,
      },
    },
    openGraph: {
      title: currentCategory.name?.[locale],
      description,
      url: canonicalUrl,
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      images: [
        {
          url: currentCategory.image || '',
          width: 1200,
          height: 630,
          alt: currentCategory.metaTitle?.[locale],
        },
      ],
    },
  }
}

export default async function ProductsPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale, categories } = await props.params
  const resolvedSearchParams = await props.searchParams
  const {
    categories: queryCategories,
    minWeight,
    maxWeight,
    page,
  } = resolvedSearchParams
  const hasQueryParams = Object.keys(resolvedSearchParams).length > 0
  const categoryPath = getCategoryPath(categories)
  const rootCategorySlug = categoryPath[0]

  if (!rootCategorySlug) {
    return <NotFoundPage />
  }

  const selectedCategories = getSelectedCategories(
    categoryPath,
    queryCategories,
  )
  const currentCategorySlug =
    selectedCategories.length === 1 ? selectedCategories[0] : rootCategorySlug

  const t = await getTranslations('product-list')
  const tPagin = await getTranslations('pagination')
  const productBgImg = getProductBgImg(t)
  const apiOrigin = await getRequestOrigin()
  const productsParams = new URLSearchParams({ locale: String(locale) })

  productsParams.append('menu', rootCategorySlug)
  if (page) productsParams.append('page', String(page))
  if (selectedCategories.length > 0) {
    productsParams.append('categories', selectedCategories.join(','))
  }
  if (minWeight) productsParams.append('minWeight', String(minWeight))
  if (maxWeight) productsParams.append('maxWeight', String(maxWeight))

  const [productsData, weightData, categoriesData, currentCategories] =
    await Promise.all([
      fetch(`${apiOrigin}/api/products/get-list?${productsParams.toString()}`, {
        cache: 'no-store',
        next: { tags: [`${fetchTags.products}`] },
      }).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),
      fetch(`${apiOrigin}/api/products/get-weight?&menu=${rootCategorySlug}`, {
        cache: 'no-store',
        next: { tags: [`${fetchTags.products}`] },
      }).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),
      fetch(
        `${apiOrigin}/api/products/get-categories?&menu=${rootCategorySlug}&locale=${locale}`,
        {
          cache: 'no-store',
          next: { tags: [`${fetchTags.products}`] },
        },
      ).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),
      fetch(
        `${apiOrigin}/api/products/current-categories?&slug=${currentCategorySlug}`,
        {
          cache: 'no-store',
          next: { tags: [`${fetchTags.products}`] },
        },
      ).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),
    ])

  if (
    !productsData ||
    !weightData ||
    !categoriesData ||
    !currentCategories?.data
  ) {
    return <NotFoundPage />
  }

  const currentCategory = currentCategories.data as unknown as ICategory
  const productListData = productsData as unknown as {
    data: IProduct[]
    currentPage: number
    totalItems: number
    totalPages: number
  }
  const childCategories = categoriesData.data as unknown as ICategory[]
  const pageInfo = page ? ` - ${t('page')} ${page}` : ''
  const weightInfo =
    minWeight && maxWeight
      ? ` (${minWeight}-${maxWeight} ${t('weight-unit')})`
      : ''
  const html = getCategoryDescriptionHtml(currentCategory.description?.[locale])
  const canonicalPath =
    selectedCategories.length === 1
      ? `products/${rootCategorySlug}/${selectedCategories[0]}`
      : `products/${rootCategorySlug}`
  const canonicalUrl = `${SITE_URL}/${locale}/${canonicalPath}`

  const flattenedProducts = productListData.data.flatMap((product: IProduct) =>
    product.variables.map((variant: IVariableProduct) => ({
      ...product,
      variant,
      key: `${product.slug}-${variant._id ?? variant.weight}`,
    })),
  )

  const getPageUrl = (pageNum: number) => {
    const newParams = new URLSearchParams()

    if (selectedCategories.length > 1) {
      newParams.set('categories', selectedCategories.join(','))
    }
    if (minWeight && String(minWeight).trim() !== '') {
      newParams.set('minWeight', String(minWeight))
    }
    if (maxWeight && String(maxWeight).trim() !== '') {
      newParams.set('maxWeight', String(maxWeight))
    }

    newParams.set('page', pageNum.toString())

    const queryString = newParams.toString()
    return queryString ? `?${queryString}` : ''
  }

  return (
    <>
      {!hasQueryParams ? (
        <ProductListJsonLd
          currentCategories={currentCategory}
          locale={locale}
          canonicalUrl={canonicalUrl}
          productsData={productListData}
          categoriesParam={canonicalPath}
        />
      ) : null}
      <main>
        <div className="mx-auto max-w-[1280px] px-5">
          <Breadcrumb className="my-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${locale}`}>{t('home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${locale}/products/${rootCategorySlug}`}
                >
                  {categoriesData.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {selectedCategories.length === 1 ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {currentCategory.name[locale]}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-end justify-between border border-[#E4E4E4]">
            <h1 className="p-[20px] text-[32px] leading-none font-black text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
              {currentCategory.h1[locale]} {pageInfo} {weightInfo}
            </h1>
          </div>
          <div className="flex w-full flex-col md:flex-row md:gap-[50px]">
            <ProductFilters
              categories={childCategories}
              weights={weightData.data.map(String)}
              rootCategorySlug={rootCategorySlug}
              activeCategorySlugs={selectedCategories}
            />
            <div className="grid w-full grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 lg:gap-7">
              {flattenedProducts.map((product: IProduct & { key: string }) => (
                <Product key={product.key} product={product} />
              ))}
            </div>
          </div>
        </div>
        {productListData.totalPages > 1 && (
          <Pagination className="mt-[94px]">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="text-[36px] md:text-[64px]"
                  label={tPagin('previous')}
                  href={
                    productListData.currentPage > 1
                      ? getPageUrl(productListData.currentPage - 1)
                      : '#'
                  }
                />
              </PaginationItem>
              {getPaginationRange(
                productListData.currentPage,
                productListData.totalPages,
              ).map((item, index) => {
                if (item === 'ellipsis') {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis className="text-xl sm:text-2xl md:text-4xl" />
                    </PaginationItem>
                  )
                }
                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      label={
                        productListData.currentPage === item
                          ? tPagin('active-page', {
                              page: productListData.currentPage + 1,
                            })
                          : typeof item === 'number'
                            ? tPagin('go-to-page', {
                                page: item,
                              })
                            : undefined
                      }
                      href={getPageUrl(item)}
                      isActive={productListData.currentPage === item}
                      className="text-xl sm:text-2xl md:text-4xl"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  className="text-[36px] md:text-[64px]"
                  label={tPagin('previous')}
                  href={
                    productListData.currentPage < productListData.totalPages
                      ? getPageUrl(productListData.currentPage + 1)
                      : '#'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <div className="bg-product-article-background relative mt-[130px] w-full py-[37px]">
          <div className="mx-auto max-w-[1280px] rounded-md bg-white/60 px-5 py-[40px] dark:bg-transparent">
            <h2 className="font-rubik mb-6 text-center text-[36px] leading-none font-bold lg:text-[64px]">
              {currentCategory.metaTitle?.[locale]}
            </h2>
            <article
              className="ql-editor prose lg:prose-xl columns-1 md:columns-2 md:gap-10"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[1380px]">
              {productBgImg.map((fruit, index) => (
                <Image
                  key={index}
                  src={`/slider/fruit/${fruit.src}.webp`}
                  alt={fruit.alt}
                  className={fruit.className}
                  width={132}
                  height={132}
                />
              ))}
            </div>
          </div>
        </div>
        <Delivery className="mt-[330px] mb-[200px]" />
        <ToTheTop />
      </main>
    </>
  )
}
