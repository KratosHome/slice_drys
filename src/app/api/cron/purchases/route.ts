import { timingSafeEqual } from 'node:crypto'

import { noStoreJson } from '@/server/api-response.server'
import { deliverPendingPurchases } from '@/server/orders/purchase-delivery.server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const actual = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  if (
    !secret ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return noStoreJson({ success: false }, { status: 401 })
  }

  try {
    const result = await deliverPendingPurchases({
      limit: 100,
      timeBudgetMs: 45_000,
    })
    return noStoreJson(result, { status: result.retried > 0 ? 503 : 200 })
  } catch {
    console.error('Purchase delivery worker could not run')
    return noStoreJson({ success: false }, { status: 503 })
  }
}
