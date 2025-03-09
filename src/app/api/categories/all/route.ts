import { NextResponse } from 'next/server'
import { getCategoryUrls } from '@/server/categories/get-category-urls.server'

export async function GET() {
  const categorySlug = await getCategoryUrls()
  return NextResponse.json(categorySlug)
}
