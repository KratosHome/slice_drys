import React from 'react'
import Product from '@/components/client/product/product'
import NotFound from '@/components/not-found'
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/client/ui/pagination'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

type Params = Promise<{ locale: ILocale; menu: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function MenuPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale, menu } = await props.params
  const t = await getTranslations('not_found_page')

  const fruits = [
    {
      src: 'orange',
      className: 'absolute left-5 top-5 w-24',
      alt: t('fruit.orange'),
    },
    {
      src: 'mango',
      className: 'absolute left-[140px] top-[250px] hidden w-12 md:block',
      alt: t('fruit.mango'),
    },
    {
      src: 'pear',
      className:
        'absolute left-[40px] top-[650px] hidden w-24 rotate-[-120deg] md:block',
      alt: t('fruit.pear'),
    },
    {
      src: 'pineapple',
      className: 'absolute bottom-24 left-36 h-12 w-12',
      alt: t('fruit.pineapple'),
    },

    {
      src: 'grapefruit',
      className: 'absolute right-10 top-12 w-28',
      alt: t('fruit.grapefruit'),
    },
    {
      src: 'pineapple',
      className: 'absolute bottom-[300px] right-[50px] w-16 rotate-45',
      alt: t('fruit.pineapple'),
    },
    {
      src: 'pineapple',
      className: 'absolute bottom-[100px] right-[140px] hidden w-16 md:block',
      alt: t('fruit.pineapple'),
    },
    {
      src: 'kiwi',
      className: 'absolute bottom-5 right-5 w-10',
      alt: t('fruit.kiwi'),
    },
  ]

  const { categories, minWeight, maxWeight, page } = await props.searchParams

  const url = process.env.NEXT_URL

  const params = new URLSearchParams({ locale: String(locale) })

  if (menu) params.append('menu', String(menu))
  if (categories) params.append('categories', String(categories))
  if (minWeight) params.append('minWeight', String(minWeight))
  if (maxWeight) params.append('maxWeight', String(maxWeight))

  const categoriesParam =
    !categories || (Array.isArray(categories) && categories.length >= 2)
      ? menu
      : categories

  const [productsData, weightData, categoriesData, currentCategories] =
    await Promise.all([
      fetch(`${url}/api/products/get-list?${params.toString()}`, {}).then(
        (res) => res.json(),
      ),

      fetch(`${url}/api/products/get-weight?&menu=${menu}`, {
        next: { revalidate: 60 },
      }).then((res) => res.json()),

      fetch(
        `${url}/api/products/get-categories?&menu=${menu}&locale=${locale}`,
        {
          next: { revalidate: 60 },
        },
      ).then((res) => res.json()),

      fetch(
        `${url}/api/products/current-categories?&slug=${categoriesParam}`,
        {},
      ).then((res) => res.json()),
    ])

  console.log(productsData)

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
    return <NotFound />
  }

  const flattenedProducts = productsData.data.flatMap((product: IProduct) =>
    product.variables.map((variant: IVariableProduct) => ({
      ...product,
      variant,
      key: `${product.slug}-${variant._id ?? variant.weight}`,
    })),
  )

  const currentPage = page ? Number(page) : 1

  const getPageUrl = (pageNum: number) => {
    const newParams = new URLSearchParams(params.toString())
    newParams.set('page', pageNum.toString())
    return `?${newParams.toString()}`
  }

  return (
    <main>
      <div className="mx-auto max-w-[1280px] px-5">
        <Breadcrumb className="my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-end justify-between border border-[#E4E4E4]">
          <h1 className="p-[20px] text-[32px] font-black leading-none text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
            {currentCategories.data.name[locale]}
          </h1>
        </div>
        <div className="flex w-full flex-col gap-[50px] md:flex-row">
          <ProductFilters
            categories={categoriesData.data}
            weights={weightData.data}
          />
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-7">
            {flattenedProducts.map((product: IProduct) => (
              <>
                <Product key={product.slug} product={product} />
              </>
            ))}
          </div>
        </div>
      </div>
      <Pagination className="mb-[130px] mt-[94px]">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={getPageUrl(1)} isActive={currentPage === 1}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={getPageUrl(2)} isActive={currentPage === 2}>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={getPageUrl(3)} isActive={currentPage === 3}>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={getPageUrl(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="relative w-full bg-[rgba(169,9,9,0.02)] py-[37px]">
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
            {fruits.map((fruit, index) => (
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
      <ToTheTop />
    </main>
  )
}
