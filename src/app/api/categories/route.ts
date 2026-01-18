import { NextResponse } from 'next/server'
import { getCategories } from '@/server/categories/get-categories.server'

export async function GET() {
  const data = await getCategories()
  return NextResponse.json(data)
}
