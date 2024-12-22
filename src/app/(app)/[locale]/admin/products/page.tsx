import EditorProduct from '@/components/admin/editor-product/editor-product'
import { ProductList } from '@/components/admin/product-list/product-list'
import { findProductInfoItems } from '@/server/products/find-product-info-items.server'
import { getProducts } from '@/server/products/get-products.server'

export default async function Home(props: IPage) {
  const params = await props.params

  const { locale } = params

  const products: IGetProduct = await getProducts(
    1,
    100,
    [],
    [],
    [],
    locale,
    true,
  )
  const recommendations: IRecommendations = await findProductInfoItems()

  return (
    <div className="px-5">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Товари</h1>
        <EditorProduct
          buttonTitle="створити"
          recommendations={recommendations}
        />
      </div>
      <ProductList data={products} recommendations={recommendations} />
    </div>
  )
}
