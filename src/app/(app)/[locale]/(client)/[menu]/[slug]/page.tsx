import { ProductInfo } from '@/components/client/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import { getProductBySlug } from '@/server/products/get-product-by-slug.server'
import NotFoundPage from '@/components/not-found'

type Params = Promise<{ locale: ILocale; slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug, locale } = await props.params

  const productJSON = await getProductBySlug({
    slug,
    locale,
  })

  const res = JSON.parse(productJSON)

  if (!res.success) {
    return <NotFoundPage />
  }

  const { product } = res

  return (
    <div className="container px-5 font-poppins lg:px-0">
      <Breadcrumbs />
      <ProductInfo product={product} />
      <Accordions nutritions={product.nutritionalValue} />
    </div>
  )
}
