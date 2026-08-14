import { redirect } from 'next/navigation'

import StatisticsDashboard from '@/components/admin/statistics/statistics-dashboard'
import { ApiError } from '@/server/api-error.server'
import { requireAdminPagePermission } from '@/server/auth/require-admin-page.server'
import { getSalesStatistics } from '@/server/statistics/get-sales-statistics.server'
import type {
  AdminSalesStatistics,
  AdminStatisticsRawQuery,
} from '@/types/admin-statistics'

interface StatisticsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function StatisticsPage({
  params,
  searchParams,
}: StatisticsPageProps) {
  const [{ locale }, rawQuery] = await Promise.all([params, searchParams])
  const identity = await requireAdminPagePermission(locale, 'statistics:read')

  if (!identity) return null

  let initialData: AdminSalesStatistics | null = null
  let hasInvalidQuery = false

  try {
    initialData = await getSalesStatistics(
      rawQuery satisfies AdminStatisticsRawQuery,
    )
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 400) {
      hasInvalidQuery = true
    } else {
      throw error
    }
  }

  if (hasInvalidQuery || !initialData) {
    redirect(`/${locale}/admin/statistics`)
  }

  return (
    <section className="px-4 py-6 sm:px-5">
      <StatisticsDashboard initialData={initialData} />
    </section>
  )
}
