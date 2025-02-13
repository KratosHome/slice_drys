import { NextResponse } from 'next/server'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'

export async function GET() {
  const data = await getProductsSliderMain('uk')
  return NextResponse.json(data)
}
