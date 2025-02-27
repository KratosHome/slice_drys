import React from 'react'
import Link from 'next/link'
import Product from '@/components/client/product/product'
import ProductSidebar from '@/components/client/prodcut-list/product-sidebar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/client/ui/dialog'
import { Button } from '@/components/admin/ui/button'
import NotFound from '@/components/not-found'
import { getProductsList } from '@/server/products/get-products-list.server'
import { getCategories } from '@/server/categories/get-categories.server'

type Params = Promise<{ locale: ILocale; menu: string; category: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function MenuPage(props: {
  params: Params
  SearchParams: SearchParams
}) {
  const { locale, menu, category } = await props.params

  const productsData = await getProductsList({
    page: 1,
    limit: 30,
    locale,
    menu: menu,
  })

  const categoriesData = await getCategories(menu)

  console.log('categoriesData', categoriesData)
  if (productsData.data.length === 0) {
    return <NotFound />
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5">
      <div className="flex items-center gap-6 py-10">
        <Link
          href="/"
          className="text-base hover:text-[#a90909] sm:text-lg md:text-xl"
        >
          Головна
        </Link>
        <p className="text-base font-semibold sm:text-lg md:text-xl">{menu}</p>
      </div>
      <div className="flex items-end justify-between border border-[#E4E4E4] p-5">
        <h2 className="text-[32px] font-black leading-none text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
          {menu}
        </h2>
      </div>
      <div className="flex items-center gap-2 px-[22px] py-[16px]">
        <div className={`hidden text-xl sm:text-2xl md:block`}>Фільтр</div>
        <Dialog>
          <DialogTrigger className="flex items-center gap-2 md:hidden">
            <div className={`text-xl sm:text-2xl`}>Фільтр</div>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className={`text-[32px]`}>Фільтр</DialogTitle>
              <DialogDescription>
                <ProductSidebar locale={locale} menu={menu} categories={[]} />
                <div className="flex items-center justify-between pb-[40px] pt-[60px]">
                  <Button
                    className="rounded-none text-base"
                    variant="outline"
                    type="button"
                    size="lg"
                  >
                    Скинути все
                  </Button>
                  <Button
                    className="rounded-none text-base"
                    type="button"
                    size="lg"
                  >
                    Показати
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="my-10 flex w-full gap-4 lg:gap-8 xl:gap-12">
        <div className="hidden w-full max-w-80 grow md:block">
          <ProductSidebar locale={locale} menu={menu} categories={[]} />
        </div>
        <div className="w-full min-w-[67%]">
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 lg:gap-7">
            {productsData.data.length > 0 ? (
              productsData.data.map((product: IProduct) => (
                <Product key={product._id} product={product} />
              ))
            ) : (
              <div>No products found in this menu.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
