import { NextResponse } from 'next/server'
import { getFeed } from '@/server/instaFeed/getFeed'

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const limit = searchParams.get('limit')

  const data = await getFeed(Number(limit))

  return NextResponse.json(data)
}
