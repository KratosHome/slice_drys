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

export const dynamic = 'force-dynamic'

type Params = Promise<{ locale: ILocale; menu: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function MenuPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale, menu } = await props.params

  const { categories, minWeight, maxWeight } = await props.searchParams

  const url = process.env.NEXT_URL

  const params = new URLSearchParams({ locale: String(locale) })

  if (menu) params.append('menu', String(menu))
  if (categories) params.append('categories', String(categories))
  if (minWeight) params.append('minWeight', String(minWeight))
  if (maxWeight) params.append('maxWeight', String(maxWeight))

  const [productsData, weightData, categoriesData] = await Promise.all([
    fetch(`${url}/api/products/get-list?${params.toString()}`, {}).then((res) =>
      res.json(),
    ),

    fetch(`${url}/api/products/get-weight?${params.toString()}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    fetch(`${url}/api/products/get-categories?${params.toString()}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
  ])

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
            {flattenedProducts.map((product: IProduct) => (
              <>
                <Product key={product.slug} product={product} />
              </>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h2>fvsdfvsd</h2>
        <div>vsfdvdfv</div>
      </div>
    </main>
  )
}
