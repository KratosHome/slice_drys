import { NextResponse } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const data = await getProductsSliderMain('uk')
  return NextResponse.json(data)
}
