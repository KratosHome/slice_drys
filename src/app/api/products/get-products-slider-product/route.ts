import { NextResponse } from 'next/server'
import { getProductsSliderProduct } from '@/server/products/get-products-slider-product.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as ILocale
  const productId = searchParams.get('productSlug') as ILocale

  const data = await getProductsSliderProduct(locale, productId)

  return NextResponse.json(data)
}
