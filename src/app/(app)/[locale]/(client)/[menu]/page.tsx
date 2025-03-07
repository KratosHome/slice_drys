import React from 'react'
import Product from '@/components/client/product/product'
import ProductFilters from '@/components/client/prodcut-list/product-filters'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import ToTheTop from '@/components/client/ui/to-the-top'
import 'quill/dist/quill.snow.css'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/client/ui/pagination'
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
    {},
  ).then((res) => res.json())

  const description = currentCategories.data.metaDescription?.[locale] || ''

  const canonicalUrl = `${url}/${categoriesParam}`

  const metaKeywordsArray =
    currentCategories.data.metaKeywords?.[locale]
      ?.split(',')
      .map((keyword: string) => keyword.trim()) || []

  return {
    title: currentCategories.data.metaTitle?.[locale],
    description: currentCategories.data.metaDescription?.[locale],
    keywords: metaKeywordsArray,
    robots: 'index, follow',
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
        next: { revalidate: 60 },
      }).then((res) => res.json()),

      fetch(`${url}/api/products/get-weight?&menu=${menu}`, {
        next: { revalidate: 60 },
      }).then((res) => res.json()),

      fetch(
        `${url}/api/products/get-categories?&menu=${menu}&locale=${locale}`,
        {
          next: { revalidate: 60 },
        },
      ).then((res) => res.json()),

      fetch(`${url}/api/products/current-categories?&slug=${categoriesParam}`, {
        next: { revalidate: 60 },
      }).then((res) => res.json()),
    ])

  const descriptionHTML = currentCategories.data.description[locale]
  const isLongText = currentCategories.data.description[locale].length > 500

  let firstPart = descriptionHTML
  let secondPart = ''

  if (isLongText) {
    const mid = Math.ceil(descriptionHTML.length / 2)
    firstPart = descriptionHTML.substring(0, mid)
    secondPart = descriptionHTML.substring(mid)
  }

  if (productsData.data.length === 0) {
    return <NotFoundPage />
  }

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
            <h1 className="p-[20px] text-[32px] font-black leading-none text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
              {currentCategories.data.name[locale]}
            </h1>
          </div>
          <div className="flex w-full flex-col md:flex-row md:gap-[50px]">
            <ProductFilters
              categories={categoriesData.data}
              weights={weightData.data}
            />
            <div className="grid w-full grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 lg:gap-7">
              {flattenedProducts.map((product: IProduct) => (
                <>
                  <Product key={product.slug} product={product} />
                </>
              ))}
            </div>
          </div>
        </div>
        {productsData.totalPages > 1 && (
          <Pagination className="mt-[94px]">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
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
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={getPageUrl(item)}
                      isActive={productsData.currentPage === item}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
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

        <div className="relative mt-[130px] w-full bg-[rgba(169,9,9,0.02)] py-[37px]">
          <div className="mx-auto max-w-[1280px] px-5">
            <h2 className="mb-6 text-center font-rubik text-3xl text-[64px] font-bold">
              {currentCategories.data.metaTitle[locale]}
            </h2>
            <div
              className={`grid gap-6 ${isLongText ? 'md:grid-cols-2' : 'grid-cols-1'}`}
            >
              {isLongText ? (
                <>
                  <article
                    className="ql-editor prose lg:prose-xl"
                    dangerouslySetInnerHTML={{ __html: firstPart }}
                  />
                  <article
                    className="ql-editor prose lg:prose-xl"
                    dangerouslySetInnerHTML={{ __html: secondPart }}
                  />
                </>
              ) : (
                <article
                  className="ql-editor prose lg:prose-xl"
                  dangerouslySetInnerHTML={{
                    __html: currentCategories.data.description[locale],
                  }}
                />
              )}
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[1380px]">
              {productBgImg.map((fruit, index) => (
                <Image
                  key={index}
                  src={`/slider/fruit/${fruit.src}.png`}
                  alt={fruit.alt}
                  className={fruit.className}
                  width={132}
                  height={132}
                />
              ))}
            </div>
          </div>
        </div>
        <Delivery />
        <ToTheTop />
      </main>
    </>
  )
}
