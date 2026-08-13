import { NextResponse } from 'next/server'
import { getPost } from '@/server/posts/get-posts.server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as ILocale
  const slug = searchParams.get('slug') as string
  const data = await getPost({ locale, slug })

  return NextResponse.json(data, { status: data.success ? 200 : 404 })
}
