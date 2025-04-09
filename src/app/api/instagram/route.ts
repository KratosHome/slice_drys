import { NextResponse } from 'next/server'
import { getFeedServer } from '@/server/instaFeed/get-feed.server'

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const limit = searchParams.get('limit')

  const data = await getFeedServer(Number(limit))

  return NextResponse.json(data)
}
