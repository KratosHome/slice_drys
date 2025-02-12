import { NextResponse } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getPosts } from '@/server/posts/get-posts.server'

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const data = await getPosts({ locale: 'en', page: 1, limit: 3 })
  return NextResponse.json(data)
}
