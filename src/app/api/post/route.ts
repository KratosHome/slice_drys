import { NextResponse } from 'next/server'
import { getPosts } from '@/server/posts/get-posts.server'

export async function GET() {
  const data = await getPosts({ locale: 'en', page: 1, limit: 3 })
  return NextResponse.json(data)
}
