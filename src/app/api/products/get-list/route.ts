import { NextResponse } from 'next/server'
import { getProductsList } from '@/server/products/get-products-list.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as ILocale

  const page = searchParams.get('page') || 1
  const menu = searchParams.get('menu') || ''
  const categories =
    searchParams
      .get('categories')
      ?.split(',')
      .map((c) => c.trim()) || []
  const minWeight = searchParams.get('minWeight') || ''
  const maxWeight = searchParams.get('maxWeight') || ''

  const data = await getProductsList({
    page: +page,
    limit: 3,
    locale: locale,
    menu: menu,
    categories: categories,
    minWeight: minWeight,
    maxWeight: maxWeight,
  })

  return NextResponse.json(data)
}
