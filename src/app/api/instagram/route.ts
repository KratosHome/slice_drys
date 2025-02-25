import { NextResponse } from 'next/server'
import { getFeed } from '@/server/instaFeed/getFeed'

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const data = await getFeed(Number(searchParams.get('limit')) ?? 6)
  return NextResponse.json(data)
}
