import type { NextRequest } from 'next/server'

import { parseAdminOrdersQuery } from '@/constants/admin-orders-query'
import { isOrderStatus } from '@/constants/order-status'
import { ApiError } from '@/server/api-error.server'
import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { getAdminOrders } from '@/server/orders/get-order.server'
import type { AdminOrdersListResponse } from '@/types/admin-order'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    if (!isOrderStatus(status)) {
      throw new ApiError(400, 'Invalid order status')
    }

    const query = parseAdminOrdersQuery((name) => searchParams.get(name))
    const result = await getAdminOrders({
      status,
      ...query,
    })
    const response: AdminOrdersListResponse = {
      success: true,
      ...result,
    }

    return noStoreJson(response)
  } catch (error) {
    return apiErrorResponse(error)
  }
}
