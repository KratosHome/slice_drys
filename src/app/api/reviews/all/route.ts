import { NextRequest, NextResponse } from 'next/server'
import { connectToDb } from '@/server/connectToDb'
import { Reviews } from '@/server/reviews/reviewsSchema'

export async function GET(req: NextRequest) {
  const searchParams = new URLSearchParams(req.url)
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const searchOptions =
    page && limit
      ? { skip: Number(page) * Number(limit), limit: Number(limit) }
      : {}

  try {
    await connectToDb()

    const data = await Reviews.find({}, searchOptions).lean<IReview[]>()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Помилка при отриманні відгуків: `, error)
    return NextResponse.json({ error: 'Помилка при отриманні відгуків' })
  }
}
