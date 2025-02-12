import { ProductInfo } from '@/components/client/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import { getProductBySlug } from '@/server/products/get-product-by-slug.server'

export default async function ProductPage({ params }: IPage) {
  const { slug, locale } = params

  const productJSON = await getProductBySlug({
    slug,
    locale,
  })

  const res = JSON.parse(productJSON)

  if (!res.success) {
    return <>Product not found</>
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
