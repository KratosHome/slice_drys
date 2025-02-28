import React from 'react'
import Product from '@/components/client/product/product'
import NotFound from '@/components/not-found'
import { getProductsList } from '@/server/products/get-products-list.server'
import { getCategories } from '@/server/categories/get-categories.server'
import ProductFilters from '@/components/client/prodcut-list/product-filters'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import { getProductWeights } from '@/server/products/get-product-weights'

type Params = Promise<{ locale: ILocale; menu: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function MenuPage(props: {
  params: Params
  SearchParams: SearchParams
}) {
  const { locale, menu } = await props.params

  const productsData = await getProductsList({
    page: 1,
    limit: 30,
    locale,
    menu: menu,
  })

  const weightData = await getProductWeights(menu)

  const categoriesData = await getCategories(menu, locale)

  console.log('weightData', weightData.data)

  if (productsData.data.length === 0) {
    return <NotFound />
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5">
      <Breadcrumb className="my-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" localizationKey="Home" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoriesData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-end justify-between border border-[#E4E4E4]">
        <h2 className="text-[32px] font-black leading-none text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
          {categoriesData.name}
        </h2>
      </div>
      <div className="flex w-full">
        <ProductFilters
          categories={categoriesData.data}
          weights={weightData.data}
        />
        <div className="w-full min-w-[67%]">
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 lg:gap-7">
            {productsData.data.map((product: IProduct) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
