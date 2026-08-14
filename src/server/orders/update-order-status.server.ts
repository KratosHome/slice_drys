import 'server-only'

import mongoose from 'mongoose'

import { isOrderStatus } from '@/constants/order-status'
import { ApiError } from '@/server/api-error.server'
import { requirePermission } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Order } from '@/server/orders/order-schema.server'
import { serializeAdminOrder } from '@/server/orders/order-serializer.server'
import type {
  AdminOrder,
  UpdateAdminOrderStatusInput,
} from '@/types/admin-order'

export async function updateAdminOrderStatus({
  orderId,
  status,
}: UpdateAdminOrderStatusInput): Promise<AdminOrder> {
  await requirePermission('orders:update-status')

  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, 'Invalid order id')
  }

  if (!isOrderStatus(status)) {
    throw new ApiError(400, 'Invalid order status')
  }

  await connectToDbServer()

  const order = await Order.findOneAndUpdate(
    { _id: orderId },
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean()

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  return serializeAdminOrder(order)
}
