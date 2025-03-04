import { NextResponse } from 'next/server'
import { getProductsSliderProduct } from '@/server/products/get-products-slider-product.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as ILocale
  const categories = searchParams.get('categories') as string
  const productId = searchParams.get('id') as ILocale

  const categoriesToArr = categories.split(',')

  const data = await getProductsSliderProduct(
    locale,
    categoriesToArr,
    productId,
  )

  return NextResponse.json(data)
}
