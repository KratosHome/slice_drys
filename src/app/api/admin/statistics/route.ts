import { ApiError } from '@/server/api-error.server'
import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { getSalesStatistics } from '@/server/statistics/get-sales-statistics.server'
import type { AdminStatisticsRawQuery } from '@/types/admin-statistics'

export const dynamic = 'force-dynamic'

const ALLOWED_QUERY_PARAMETERS = new Set(['period', 'from', 'to'])

function getRawQuery(searchParams: URLSearchParams): AdminStatisticsRawQuery {
  for (const name of searchParams.keys()) {
    if (!ALLOWED_QUERY_PARAMETERS.has(name)) {
      throw new ApiError(400, `Unknown query parameter "${name}"`)
    }
  }

  const read = (name: string): string | string[] | undefined => {
    const values = searchParams.getAll(name)

    if (values.length === 0) return undefined
    return values.length === 1 ? values[0] : values
  }

  return {
    period: read('period'),
    from: read('from'),
    to: read('to'),
  }
}

export async function GET(request: Request) {
  try {
    const statistics = await getSalesStatistics(
      getRawQuery(new URL(request.url).searchParams),
    )

    return noStoreJson({
      success: true as const,
      data: statistics,
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
