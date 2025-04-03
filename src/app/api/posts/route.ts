import { NextResponse } from 'next/server'
import { getPosts } from '@/server/posts/get-posts.server'

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams

  const data = await getPosts({
    locale: (searchParams.get('locale') as ILocale) ?? 'uk',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 5,
  })
  return NextResponse.json(data)
}
