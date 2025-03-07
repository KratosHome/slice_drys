import { NextResponse } from 'next/server'
import { getCurrentCategory } from '@/server/categories/curent-categories.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || ''

  const data = await getCurrentCategory(slug)

  return NextResponse.json(data)
}
