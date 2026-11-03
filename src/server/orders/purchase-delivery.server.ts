import 'server-only'

import { randomUUID } from 'node:crypto'

import { connectToDbServer } from '@/server/connect-to-db.server'
import {
  getOrderReceipt,
  type ReceiptOrder,
} from '@/server/orders/order-receipt'
import { Order } from '@/server/orders/order-schema.server'

const LEASE_MS = 60_000
const HTTP_TIMEOUT_MS = 5_000
const DB_TIMEOUT_MS = 5_000

interface ClaimedPurchase extends ReceiptOrder {
  createdAt: Date
  purchaseDelivery: { clientId: string; attempts: number }
}

export function purchaseDeliveryEnabled() {
  return (
    process.env.NODE_ENV !== 'development' &&
    process.env.VERCEL_ENV !== 'development' &&
    process.env.VERCEL_ENV !== 'preview'
  )
}

function collectorUrl() {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  const secret = process.env.GA4_API_SECRET?.trim()
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId) || !secret) {
    throw new Error('Purchase delivery credentials are missing or invalid')
  }
  const url = new URL('https://www.google-analytics.com/mp/collect')
  url.searchParams.set('measurement_id', measurementId)
  url.searchParams.set('api_secret', secret)
  return url
}

function requestBody(order: ClaimedPurchase) {
  const receipt = getOrderReceipt(order)
  return JSON.stringify({
    client_id: order.purchaseDelivery.clientId,
    timestamp_micros: order.createdAt.getTime() * 1000,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: receipt.transactionId,
          currency: receipt.currency,
          value: receipt.value,
          items: receipt.items.map((item) => ({
            item_id: item.id,
            item_name: [...item.name].slice(0, 100).join(''),
            item_variant: `${item.weight} g`,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    ],
  })
}

function timeoutUntil(deadline: number, maximumMs: number) {
  return Math.max(1, Math.min(maximumMs, deadline - Date.now()))
}

async function connectBefore(deadline: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      connectToDbServer(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('Connection timed out')),
          timeoutUntil(deadline, DB_TIMEOUT_MS),
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function submit(order: ClaimedPurchase, url: URL, deadline: number) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody(order),
      signal: AbortSignal.timeout(timeoutUntil(deadline, HTTP_TIMEOUT_MS)),
      cache: 'no-store',
      redirect: 'error',
    })
    return response.ok ? undefined : `HTTP ${response.status}`
  } catch {
    // A timeout can occur even after collection. Replay the same purchase IDs.
    return 'Collector unavailable'
  }
}

interface DeliveryOptions {
  orderId?: string
  limit?: number
  timeBudgetMs?: number
}

export async function deliverPendingPurchases({
  orderId,
  limit = 50,
  timeBudgetMs = 45_000,
}: DeliveryOptions = {}) {
  const result = { received: 0, retried: 0 }
  if (!purchaseDeliveryEnabled()) return result
  const url = collectorUrl()
  const deadline = Date.now() + timeBudgetMs

  try {
    await connectBefore(deadline)
    for (let i = 0; i < limit && Date.now() < deadline; i++) {
      const leaseId = randomUUID()
      // nextAttemptAt also acts as the lease expiry if this process stops.
      const order = await Order.findOneAndUpdate(
        {
          ...(orderId ? { _id: orderId } : {}),
          'purchaseDelivery.state': 'pending',
          'purchaseDelivery.nextAttemptAt': { $lte: new Date() },
        },
        {
          $set: {
            'purchaseDelivery.leaseId': leaseId,
            'purchaseDelivery.nextAttemptAt': new Date(Date.now() + LEASE_MS),
          },
          $inc: { 'purchaseDelivery.attempts': 1 },
        },
        {
          sort: { 'purchaseDelivery.nextAttemptAt': 1 },
          returnDocument: 'after',
          projection: {
            _id: 1,
            createdAt: 1,
            total: 1,
            products: 1,
            'purchaseDelivery.clientId': 1,
            'purchaseDelivery.attempts': 1,
          },
          timestamps: false,
          timeoutMS: timeoutUntil(deadline, DB_TIMEOUT_MS),
        },
      ).lean<ClaimedPurchase | null>()
      if (!order) break

      const error = await submit(order, url, deadline)
      const update = error
        ? {
            $set: {
              'purchaseDelivery.nextAttemptAt': new Date(
                Date.now() +
                  Math.min(
                    30_000 * 2 ** (order.purchaseDelivery.attempts - 1),
                    3_600_000,
                  ),
              ),
              'purchaseDelivery.lastError': error,
            },
            $unset: { 'purchaseDelivery.leaseId': 1 },
          }
        : {
            $set: {
              'purchaseDelivery.state': 'received',
              'purchaseDelivery.receivedAt': new Date(),
            },
            $unset: {
              'purchaseDelivery.leaseId': 1,
              'purchaseDelivery.nextAttemptAt': 1,
              'purchaseDelivery.lastError': 1,
            },
          }
      const ack = await Order.updateOne(
        { _id: order._id, 'purchaseDelivery.leaseId': leaseId },
        update,
        { timestamps: false, timeoutMS: timeoutUntil(deadline, DB_TIMEOUT_MS) },
      )
      if (ack.modifiedCount) result[error ? 'retried' : 'received']++
    }
  } catch {
    // A failed acknowledgement leaves a recoverable lease. Never log request URLs.
    throw new Error('Purchase delivery database unavailable')
  }
  return result
}
