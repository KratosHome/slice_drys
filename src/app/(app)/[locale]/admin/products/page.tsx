import EditorProduct from '@/components/admin/editor-product/editor-product'
import { ProductList } from '@/components/admin/product-list/product-list'
import { findProductInfoItems } from '@/server/products/find-product-info-items.server'
import { getProducts } from '@/server/products/get-products.server'
import { getCategories } from '@/server/categories/get-categories.server'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

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
  const dataCategories: IResult<ICategory> = await getCategories()

  return (
    <div className="px-5">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Товари</h1>
        <EditorProduct
          buttonTitle="створити"
          recommendations={recommendations}
          categories={dataCategories.data}
        />
      </div>
      <ProductList
        data={products}
        recommendations={recommendations}
        categories={dataCategories.data}
      />
    </div>
  )
}
