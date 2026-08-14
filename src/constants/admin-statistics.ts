import type {
  AdminStatisticsGrain,
  AdminStatisticsPeriod,
} from '@/types/admin-statistics'

export const ADMIN_STATISTICS_TIME_ZONE = 'Europe/Kyiv' as const

export const ADMIN_STATISTICS_PERIODS = [
  'all',
  'today',
  '7d',
  '30d',
  '90d',
  'this-year',
  'custom',
] as const satisfies readonly AdminStatisticsPeriod[]

export const DEFAULT_ADMIN_STATISTICS_PERIOD: AdminStatisticsPeriod = 'all'

export const ADMIN_STATISTICS_TOP_PRODUCTS_LIMIT = 10
export const ADMIN_STATISTICS_TOP_CITIES_LIMIT = 10
export const ADMIN_STATISTICS_MAX_CUSTOM_DAYS = 3_660
export const ADMIN_STATISTICS_MAX_TIME_MS = 10_000

export const ADMIN_STATISTICS_GRAIN_BY_PERIOD: Record<
  Exclude<AdminStatisticsPeriod, 'custom'>,
  AdminStatisticsGrain
> = {
  all: 'month',
  today: 'hour',
  '7d': 'day',
  '30d': 'day',
  '90d': 'week',
  'this-year': 'month',
}

export function isAdminStatisticsPeriod(
  value: unknown,
): value is AdminStatisticsPeriod {
  return (
    typeof value === 'string' &&
    (ADMIN_STATISTICS_PERIODS as readonly string[]).includes(value)
  )
}
