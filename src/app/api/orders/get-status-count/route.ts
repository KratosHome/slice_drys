import { NextResponse } from 'next/server'
import { getOrderStatusCounts } from '@/server/orders/get-status-order.server'

export async function GET() {
  const data = await getOrderStatusCounts()

  return NextResponse.json(data)
}
