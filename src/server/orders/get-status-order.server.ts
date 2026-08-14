'use server'

import { ORDER_STATUSES, isOrderStatus } from '@/constants/order-status'
import { requireAdmin } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Order } from '@/server/orders/order-schema.server'
import type { AdminOrderStatusCounts } from '@/types/admin-order'

interface StatusCountResult {
  _id: unknown
  count: number
}

export async function getOrderStatusCounts(): Promise<AdminOrderStatusCounts> {
  await requireAdmin()
  await connectToDbServer()

  const statusCounts = await Order.aggregate<StatusCountResult>([
    {
      $match: {
        status: { $in: ORDER_STATUSES },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as AdminOrderStatusCounts

  for (const { _id, count } of statusCounts) {
    if (isOrderStatus(_id)) counts[_id] = count
  }

  return counts
}
