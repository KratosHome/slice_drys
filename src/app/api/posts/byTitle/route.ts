import { NextResponse } from 'next/server'
import { getPost } from '@/server/posts/get-posts.server'

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const data = await getPost({
    locale: (searchParams.get('locale') as ILocale) ?? 'uk',
    slug: searchParams.get('slug') || '',
    isVisited: Boolean(searchParams.get('slug')),
  })
  return NextResponse.json(data)
}
