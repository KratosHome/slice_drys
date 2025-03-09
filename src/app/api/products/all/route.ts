import { NextResponse } from 'next/server'
import { getProductsUrls } from '@/server/products/get-products-urls.server'

export async function GET() {
  const productSlug = await getProductsUrls()
  return NextResponse.json(productSlug)
}
