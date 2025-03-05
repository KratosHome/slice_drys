import { NextResponse } from 'next/server'
import { getUrls } from '@/server/products/get-urls.server'

export async function GET() {
  const data = await getUrls()

  return NextResponse.json(data)
}
