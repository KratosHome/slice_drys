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

type Params = Promise<{ locale: ILocale; menu: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const mockData = {
  title: 'М’ясні джерки',
  content: `Шукаєте смачний, поживний і натуральний перекус? М’ясні джерки – це ідеальне рішення для тих, хто цінує якість, смак та здорове харчування.\n\n**Що таке м’ясні джерки?**\nМ’ясні джерки — це в’ялене м’ясо, приготовлене за спеціальною технологією сушіння. Завдяки цьому зберігається максимум користі та смаку без зайвих консервантів.\n\n**Чому обирають наші джерки?**\n- 100% натуральний склад – без штучних добавок та ГМО\n- Високий вміст білка – ідеально для спортсменів та активних людей\n- Зручність – легкі, компактні, не потребують зберігання в холодильнику\n- Різноманіття смаків – класичні, гострі, пряні, BBQ\n\n**Для кого підходять м’ясні джерки?**\n- Спортсменів і людей, які стежать за харчуванням\n- Мандрівників та туристів\n- Водіїв, офісних працівників, студентів\n- Усіх, хто любить якісні м’ясні закуски`,
}

export default async function MenuPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale, menu } = await props.params

  const { categories, minWeight, maxWeight } = await props.searchParams

  const text = mockData.content
  const isLongText = text.length > 500

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
        <h2 className="p-[20px] text-[32px] font-black leading-none text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
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
        <div className="mx-auto max-w-5xl p-6">
          <h1 className="mb-6 text-center text-3xl font-bold">
            {mockData.title}
          </h1>
          <div
            className={`grid gap-6 ${isLongText ? 'md:grid-cols-2' : 'grid-cols-1'}`}
          >
            {isLongText ? (
              text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-lg leading-relaxed">{text}</p>
            )}
          </div>
        </div>
      </div>
      <ToTheTop />
    </main>
  )
}
