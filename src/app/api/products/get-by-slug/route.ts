import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/server/products/get-product-by-slug.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as ILocale
  const slug = searchParams.get('slug') as string

  const data = await getProductBySlug({
    slug,
    locale,
  })

  return NextResponse.json(data)
}
