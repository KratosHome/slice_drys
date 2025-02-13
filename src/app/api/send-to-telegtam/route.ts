// src/app/api/send-to-telegram/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('API route hit')
  try {
    const body = await request.json()
    console.log('Received body:', body)
    const { phone } = body

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID
    const message = `Новий номер телефону: ${phone}`

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      },
    )

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API route error:', error)
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 },
    )
  }
}
