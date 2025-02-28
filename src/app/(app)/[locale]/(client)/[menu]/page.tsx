import React from 'react'
import Link from 'next/link'
import { getProducts } from '@/server/products/get-products.server'
import Product from '@/components/client/product/product'
import ProductMenu from '@/components/client/product-menu/product-menu'
import ProductSidebar from '@/components/client/product-sidebar/product-sidebar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/client/ui/dialog'
import { Button } from '@/components/admin/ui/button'
import { capitalize } from '@/utils/capitalize'
import { menuToUk } from '@/utils/menuToUk'
import NotFound from '@/components/not-found'

export default async function MenuPage(props: {
  params: Promise<{ locale: string; menu: string; category: string }>
}) {
  const { params } = props
  const { locale, menu, category } = await params
  const menuToLocale = locale === 'uk' ? menuToUk(menu) : menu
  const categoryArray = category ? category.split(',') : []

  const productsData = await getProducts(
    1,
    100,
    [],
    [menuToLocale],
    categoryArray,
    locale,
    false,
  )

  const { product: products } = productsData

  const allMenus = ['meat', 'fruits', 'vegetables', 'mix']
  const translatedMenus = allMenus.map((menu) => ({
    key: menu,
    label: locale === 'uk' ? menuToUk(menu) : menu,
  }))

  const filteredMenus = translatedMenus.filter(
    (menuItem) => menuItem.key !== menu,
  )

  if (products.length === 0) {
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
        <p className="text-base font-semibold sm:text-lg md:text-xl">
          {capitalize(menuToLocale)}
        </p>
      </div>
      <ProductMenu
        menuToLocale={menuToLocale}
        filteredMenus={filteredMenus}
        locale={locale}
        capitalize={capitalize}
      />
      <div className="flex items-center gap-2 px-[22px] py-[16px]">
        <div className={`hidden text-xl sm:text-2xl md:block`}>Фільтр</div>
        <div className="hidden md:block">rr</div>
        <Dialog>
          <DialogTrigger className="flex items-center gap-2 md:hidden">
            <div className={`text-xl sm:text-2xl`}>Фільтр</div>
            rrr
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
            {products.length > 0 ? (
              products.map((product: IProduct) => (
                <Product key={product._id} product={product} />
              ))
            ) : (
              <div>No products found in this menu.</div>
            )}
          </div>
          {products.length > 10 ? (
            <div className="py-10 text-center text-3xl">
              Pagination - coming soon
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
