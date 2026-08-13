import { NextResponse } from 'next/server'
import { getProductsList } from '@/server/products/get-products-list.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as ILocale

  const pageParam = searchParams.get('page') || '1'
  const page = Number(pageParam)
  const menu = searchParams.get('menu') || ''
  const categories =
    searchParams
      .get('categories')
      ?.split(',')
      .map((c) => c.trim()) || []
  const minWeight = searchParams.get('minWeight') || ''
  const maxWeight = searchParams.get('maxWeight') || ''

  if (!Number.isSafeInteger(page) || page < 1 || !menu) {
    return NextResponse.json(
      { success: false, message: 'Invalid pagination or category', data: [] },
      { status: 400 },
    )
  }

  const data = await getProductsList({
    page,
    limit: 3,
    locale: locale,
    menu: menu,
    categories: categories,
    minWeight: minWeight,
    maxWeight: maxWeight,
  })

  return NextResponse.json(data, { status: data.success ? 200 : 404 })
}
