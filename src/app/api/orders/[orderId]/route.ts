import type { NextRequest } from 'next/server'

import { isOrderStatus } from '@/constants/order-status'
import { ApiError } from '@/server/api-error.server'
import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { getAdminOrderById } from '@/server/orders/get-order.server'
import { updateAdminOrderStatus } from '@/server/orders/update-order-status.server'
import type { AdminOrderResponse } from '@/types/admin-order'

export const dynamic = 'force-dynamic'

interface OrderRouteContext {
  params: Promise<{ orderId: string }>
}

async function getOrderId(context: OrderRouteContext): Promise<string> {
  const { orderId } = await context.params
  return orderId
}

export async function GET(_request: NextRequest, context: OrderRouteContext) {
  try {
    const order = await getAdminOrderById(await getOrderId(context))
    const response: AdminOrderResponse = {
      success: true,
      data: order,
    }

    return noStoreJson(response)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: OrderRouteContext) {
  try {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'Request body must be valid JSON')
    }

    const status =
      typeof body === 'object' && body !== null && 'status' in body
        ? body.status
        : undefined

    if (!isOrderStatus(status)) {
      throw new ApiError(400, 'Invalid order status')
    }

    const order = await updateAdminOrderStatus({
      orderId: await getOrderId(context),
      status,
    })
    const response: AdminOrderResponse = {
      success: true,
      data: order,
    }

    return noStoreJson(response)
  } catch (error) {
    return apiErrorResponse(error)
  }
}
