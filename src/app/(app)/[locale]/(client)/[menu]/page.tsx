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
import { getProductBgImg } from '@/data/product-bg-img'
import ProductListJsonLd from '@/components/client/json-ld/product-list-json-ld'
import Delivery from '@/components/client/promo-banner/delivery'
import { getPaginationRange } from '@/utils/get-pagination-range'
import { locales } from '@/data/locales'
import { getCategoryUrls } from '@/server/categories/get-category-urls.server'
import NotFoundPage from '@/components/not-found'
import { fetchTags } from '@/data/fetch-tags'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import 'quill/dist/quill.snow.css'

export const revalidate = 86400

type Params = Promise<{ locale: ILocale; menu: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}): Promise<Metadata> {
  const url = process.env.NEXT_URL

  const { locale, menu } = await params
  const { categories } = await searchParams

  const categoriesParam =
    !categories || categories.includes(',') ? menu : categories

  const currentCategories = await fetch(
    `${url}/api/products/current-categories?&slug=${categoriesParam}`,
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

  if (!currentCategories) {
    return {
      title: 'categories not found',
      description: 'categories not found',
    }
  }

  const description = currentCategories.data.metaDescription?.[locale] || ''

  const canonicalUrl = `${url}/${locale}/${categoriesParam}`

  const metaKeywordsArray =
    currentCategories.data.metaKeywords?.[locale]
      ?.split(',')
      .map((keyword: string) => keyword.trim()) || []

  return {
    title: currentCategories.data.metaTitle?.[locale],
    description: currentCategories.data.metaDescription?.[locale],
    keywords: metaKeywordsArray,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${canonicalUrl}`,
        uk: `${canonicalUrl}`,
      },
    },
    openGraph: {
      title: currentCategories.data.name?.[locale],
      description,
      url: canonicalUrl,
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      images: [
        {
          url: currentCategories.data.image,
          width: 1200,
          height: 630,
          alt: currentCategories.data.metaTitle?.[locale],
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  const categorySlug = await getCategoryUrls()

  return categorySlug.data.flatMap((item: { slug: string }) =>
    locales.map((locale) => ({
      menu: item.slug,
      locale,
    })),
  )
}

export default async function MenuPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale, menu } = await props.params
  const { categories, minWeight, maxWeight, page } = await props.searchParams

  const params = new URLSearchParams({ locale: String(locale) })

  const t = await getTranslations('product-list')
  const tPagin = await getTranslations('pagination')

  const productBgImg = getProductBgImg(t)
  const url = process.env.NEXT_URL

  if (menu) params.append('menu', String(menu))
  if (page) params.append('page', String(page))
  if (categories) params.append('categories', String(categories))
  if (minWeight) params.append('minWeight', String(minWeight))
  if (maxWeight) params.append('maxWeight', String(maxWeight))

  const categoriesParam = Array.isArray(categories)
    ? categories.join(',')
    : !categories || categories.includes(',')
      ? menu
      : categories

  const [productsData, weightData, categoriesData, currentCategories] =
    await Promise.all([
      fetch(`${url}/api/products/get-list?${params.toString()}`, {
        cache: 'no-store',
        next: { tags: [`${fetchTags.products}`] },
      }).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),

      fetch(`${url}/api/products/get-weight?&menu=${menu}`, {
        cache: 'no-store',
        next: { tags: [`${fetchTags.products}`] },
      }).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),

      fetch(
        `${url}/api/products/get-categories?&menu=${menu}&locale=${locale}`,
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

      fetch(`${url}/api/products/current-categories?&slug=${categoriesParam}`, {
        cache: 'no-store',
        next: { tags: [`${fetchTags.products}`] },
      }).then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.success === false) return null
        return data
      }),
    ])

  if (!productsData) {
    return <NotFoundPage />
  }

  const pageInfo = page ? ` - ${t('page')} ${page}` : ''
  const weightInfo =
    minWeight && maxWeight
      ? ` (${minWeight}-${maxWeight} ${t('weight-unit')})`
      : ''

  const content = JSON.parse(currentCategories.data.description[locale])
  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()
  // .replace(/(<p>(?:<br\/>)+<\/p>)|((?:<br\/>)+)/g, '')

  const flattenedProducts = productsData.data.flatMap((product: IProduct) =>
    product.variables.map((variant: IVariableProduct) => ({
      ...product,
      variant,
      key: `${product.slug}-${variant._id ?? variant.weight}`,
    })),
  )

  const getPageUrl = (pageNum: number) => {
    const newParams = new URLSearchParams()

    if (categories && String(categories).trim() !== '') {
      newParams.set('categories', String(categories))
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

  const canonicalUrl = `${url}/${categoriesParam}`

  return (
    <>
      <ProductListJsonLd
        currentCategories={currentCategories.data}
        locale={locale}
        canonicalUrl={canonicalUrl}
        productsData={productsData}
        categoriesParam={categoriesParam}
      />
      <main>
        <div className="mx-auto max-w-[1280px] px-5">
          <Breadcrumb className="my-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentCategories.data.name[locale]}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-end justify-between border border-[#E4E4E4]">
            <h1 className="p-[20px] text-[32px] leading-none font-black text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
              {currentCategories.data.h1[locale]} {pageInfo} {weightInfo}
            </h1>
          </div>
          <div className="flex w-full flex-col md:flex-row md:gap-[50px]">
            <ProductFilters
              categories={categoriesData.data}
              weights={weightData.data}
            />
            <div className="grid w-full grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 lg:gap-7">
              {flattenedProducts.map((product: IProduct & { key: string }) => (
                <Product key={product.key} product={product} />
              ))}
            </div>
          </div>
        </div>
        {productsData.totalPages > 1 && (
          <Pagination className="mt-[94px]">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="text-[36px] md:text-[64px]"
                  label={tPagin('previous')}
                  href={
                    productsData.currentPage > 1
                      ? getPageUrl(productsData.currentPage - 1)
                      : '#'
                  }
                />
              </PaginationItem>
              {getPaginationRange(
                productsData.currentPage,
                productsData.totalPages,
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
                        productsData.currentPage === item
                          ? tPagin('active-page', {
                              page: productsData.currentPage + 1,
                            })
                          : typeof item === 'number'
                            ? tPagin('go-to-page', {
                                page: item,
                              })
                            : undefined
                      }
                      href={getPageUrl(item)}
                      isActive={productsData.currentPage === item}
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
                    productsData.currentPage < productsData.totalPages
                      ? getPageUrl(productsData.currentPage + 1)
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
              {currentCategories.data.metaTitle[locale]}
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
