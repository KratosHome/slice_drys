import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { getOrderStatusCounts } from '@/server/orders/get-status-order.server'
import type { AdminOrderStatusCountsResponse } from '@/types/admin-order'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getOrderStatusCounts()
    const response: AdminOrderStatusCountsResponse = {
      success: true,
      data,
    }

    return noStoreJson(response)
  } catch (error) {
    return apiErrorResponse(error)
  }
}
