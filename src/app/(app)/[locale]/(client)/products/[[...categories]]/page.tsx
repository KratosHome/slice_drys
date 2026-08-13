import React from 'react'
import { notFound, permanentRedirect } from 'next/navigation'
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
import { getProductBgImg } from '@/data/product-bg-img'
import ProductListJsonLd from '@/components/client/json-ld/product-list-json-ld'
import Delivery from '@/components/client/promo-banner/delivery'
import { getPaginationRange } from '@/utils/get-pagination-range'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import 'quill/dist/quill.snow.css'
import { SITE_URL } from '@/data/contacts'
import {
  getPublicCategories,
  getPublicCurrentCategory,
  getPublicProductsList,
  getPublicProductWeights,
} from '@/server/public-data-cache.server'

export const revalidate = 86400

type Params = Promise<{ locale: ILocale; categories?: string[] }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const getCategoryPath = (categories?: string[]) =>
  (categories ?? []).map((category) => category.toLowerCase())

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

const getSingleSearchValue = (
  value: string | string[] | undefined,
): string | undefined => (typeof value === 'string' ? value : undefined)

const parsePageNumber = (value: string | string[] | undefined) => {
  if (value === undefined) return 1
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null

  const page = Number(value)
  return Number.isSafeInteger(page) && page >= 1 ? page : null
}

const normalizeSelectedCategories = (
  pathCategories: string[],
  queryCategories?: string | string[],
) =>
  Array.from(
    new Set(
      getSelectedCategories(pathCategories, queryCategories)
        .map((category) => category.trim().toLowerCase())
        .filter(Boolean),
    ),
  )

const serializeSearchParams = (
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

const getCatalogIdentity = async (
  locale: ILocale,
  categories: string[] | undefined,
  searchParams: Record<string, string | string[] | undefined>,
) => {
  const originalPath = categories ?? []
  const categoryPath = getCategoryPath(categories)
  const rootCategorySlug = categoryPath[0]

  if (!rootCategorySlug || categoryPath.length > 2) notFound()

  const [rootCategoryResult, categoriesData] = await Promise.all([
    getPublicCurrentCategory(rootCategorySlug),
    getPublicCategories(rootCategorySlug, locale),
  ])

  if (!rootCategoryResult.success || !rootCategoryResult.data) notFound()
  if (rootCategoryResult.data.parentCategory != null) notFound()
  if (!categoriesData.success) notFound()

  const childCategories = categoriesData.data
  // Mixes and promotions expose cross-category filter options, not real URL
  // descendants. Keep those choices in query parameters only.
  const pathChildCategories =
    rootCategorySlug === 'mixes' || rootCategorySlug === 'promotions'
      ? []
      : childCategories
  const allowedCategorySlugs = new Set(
    childCategories.map(({ slug }) => slug.toLowerCase()),
  )
  const pathChildSlug = categoryPath[1]

  const allowedPathCategorySlugs = new Set(
    pathChildCategories.map(({ slug }) => slug.toLowerCase()),
  )

  if (pathChildSlug && !allowedPathCategorySlugs.has(pathChildSlug)) notFound()

  const selectedCategories = normalizeSelectedCategories(
    categoryPath,
    searchParams.categories,
  )
  if (
    selectedCategories.some((category) => !allowedCategorySlugs.has(category))
  ) {
    notFound()
  }

  const currentCategorySlug = pathChildSlug ?? rootCategorySlug
  const currentCategoryResult =
    currentCategorySlug === rootCategorySlug
      ? rootCategoryResult
      : await getPublicCurrentCategory(currentCategorySlug)

  if (!currentCategoryResult.success || !currentCategoryResult.data) {
    notFound()
  }

  const canonicalPath = pathChildSlug
    ? `products/${rootCategorySlug}/${pathChildSlug}`
    : `products/${rootCategorySlug}`

  return {
    categoryPath,
    originalPath,
    rootCategorySlug,
    selectedCategories,
    currentCategory: currentCategoryResult.data,
    rootCategory: rootCategoryResult.data,
    childCategories,
    categoryName: categoriesData.name ?? rootCategoryResult.data.name[locale],
    canonicalPath,
  }
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
  const page = parsePageNumber(resolvedSearchParams.page)
  if (page === null) notFound()

  const { currentCategory, canonicalPath } = await getCatalogIdentity(
    locale,
    categories,
    resolvedSearchParams,
  )
  const hasFacetQuery =
    resolvedSearchParams.categories !== undefined ||
    resolvedSearchParams.minWeight !== undefined ||
    resolvedSearchParams.maxWeight !== undefined
  const pageSuffix = !hasFacetQuery && page > 1 ? `?page=${page}` : ''
  const canonicalUrl = `${SITE_URL}/${locale}/${canonicalPath}${pageSuffix}`
  const description = currentCategory.metaDescription?.[locale] || ''
  const socialTitle =
    currentCategory.metaTitle?.[locale] ?? currentCategory.name[locale]
  const socialImage = currentCategory.image
  const metaKeywordsArray =
    currentCategory.metaKeywords?.[locale]
      ?.split(',')
      .map((keyword: string) => keyword.trim()) || []

  return {
    title:
      page > 1 && !hasFacetQuery
        ? `${currentCategory.metaTitle?.[locale] ?? currentCategory.name[locale]} — ${locale === 'uk' ? 'Сторінка' : 'Page'} ${page}`
        : currentCategory.metaTitle?.[locale],
    description,
    keywords: metaKeywordsArray,
    robots: hasFacetQuery
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/${canonicalPath}${pageSuffix}`,
        uk: `${SITE_URL}/uk/${canonicalPath}${pageSuffix}`,
        'x-default': `${SITE_URL}/uk/${canonicalPath}${pageSuffix}`,
      },
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      images: socialImage ? [{ url: socialImage, alt: socialTitle }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: socialImage ? [socialImage] : [],
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
    page: pageParam,
  } = resolvedSearchParams
  const page = parsePageNumber(pageParam)
  const minWeightValue = getSingleSearchValue(minWeight)
  const maxWeightValue = getSingleSearchValue(maxWeight)

  if (page === null || Array.isArray(minWeight) || Array.isArray(maxWeight)) {
    notFound()
  }

  const numericMinWeight =
    minWeightValue === undefined ? undefined : Number(minWeightValue)
  const numericMaxWeight =
    maxWeightValue === undefined ? undefined : Number(maxWeightValue)

  if (
    (numericMinWeight !== undefined &&
      (!Number.isFinite(numericMinWeight) || numericMinWeight < 0)) ||
    (numericMaxWeight !== undefined &&
      (!Number.isFinite(numericMaxWeight) || numericMaxWeight < 0)) ||
    (numericMinWeight !== undefined &&
      numericMaxWeight !== undefined &&
      numericMinWeight > numericMaxWeight)
  ) {
    notFound()
  }

  const {
    categoryPath,
    originalPath,
    rootCategorySlug,
    selectedCategories,
    currentCategory,
    rootCategory,
    childCategories,
    categoryName,
    canonicalPath,
  } = await getCatalogIdentity(locale, categories, resolvedSearchParams)

  const canonicalRoute = `/${locale}/${canonicalPath}`
  const normalizedSearchParams = { ...resolvedSearchParams }
  if (page === 1) delete normalizedSearchParams.page
  else normalizedSearchParams.page = String(page)

  if (
    originalPath.some((value, index) => value !== categoryPath[index]) ||
    (pageParam !== undefined && (page === 1 || pageParam !== String(page)))
  ) {
    permanentRedirect(
      serializeSearchParams(canonicalRoute, normalizedSearchParams),
    )
  }

  const [productsData, weightData, t, tPagin] = await Promise.all([
    getPublicProductsList({
      page,
      limit: 3,
      menu: rootCategorySlug,
      locale,
      categories: selectedCategories,
      minWeight: minWeightValue,
      maxWeight: maxWeightValue,
    }),
    getPublicProductWeights(rootCategorySlug),
    getTranslations('product-list'),
    getTranslations('pagination'),
  ])

  if (!productsData.success || !weightData.success) notFound()

  const productListData = productsData as unknown as {
    data: IProduct[]
    currentPage: number
    totalItems: number
    totalPages: number
  }
  if (
    page > 1 &&
    (productListData.totalPages === 0 || page > productListData.totalPages)
  ) {
    notFound()
  }

  const hasFacetQuery =
    queryCategories !== undefined ||
    minWeightValue !== undefined ||
    maxWeightValue !== undefined
  const pageInfo = page > 1 ? ` - ${t('page')} ${page}` : ''
  const weightInfo =
    minWeightValue && maxWeightValue
      ? ` (${minWeightValue}-${maxWeightValue} ${t('weight-unit')})`
      : ''
  const productBgImg = getProductBgImg(t)
  const html = getCategoryDescriptionHtml(currentCategory.description?.[locale])
  const pageSuffix = !hasFacetQuery && page > 1 ? `?page=${page}` : ''
  const canonicalUrl = `${SITE_URL}/${locale}/${canonicalPath}${pageSuffix}`

  const productCards = productListData.data.flatMap((product: IProduct) =>
    product.variables.map((initialVariant: IVariableProduct) => ({
      product,
      initialVariant,
      key: `${product.slug}-${initialVariant._id ?? initialVariant.weight}`,
    })),
  )

  const getPageUrl = (pageNum: number) => {
    const nextSearchParams = { ...resolvedSearchParams }
    if (categoryPath[1]) delete nextSearchParams.categories
    if (pageNum === 1) delete nextSearchParams.page
    else nextSearchParams.page = String(pageNum)

    return serializeSearchParams(canonicalRoute, nextSearchParams)
  }

  return (
    <>
      {!hasFacetQuery ? (
        <ProductListJsonLd
          currentCategories={currentCategory}
          rootCategory={rootCategory}
          locale={locale}
          canonicalUrl={canonicalUrl}
          productsData={productListData}
          categoriesParam={canonicalPath}
        />
      ) : null}
      <section>
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
                  {categoryName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {categoryPath[1] ? (
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
              {productCards.map(({ product, initialVariant, key }, index) => (
                <Product
                  key={key}
                  product={product}
                  initialVariant={initialVariant}
                  priority={index === 0}
                />
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
                  disabled={productListData.currentPage === 1}
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
                              page: productListData.currentPage,
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
                  label={tPagin('next')}
                  disabled={
                    productListData.currentPage === productListData.totalPages
                  }
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
      </section>
    </>
  )
}
