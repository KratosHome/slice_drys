import { NextResponse } from 'next/server'
import { getPostsUrls } from '@/server/posts/get-ports-urls.server'

export async function GET() {
  const data = await getPostsUrls()
  return NextResponse.json(data)
}
