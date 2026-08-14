import type { AdminStatisticsGrain } from '@/types/admin-statistics'

const TIME_ZONE = 'Europe/Kyiv'

const currencyNumberFormatter = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('uk-UA', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 0,
})

const percentageFormatter = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number): string {
  return `${currencyNumberFormatter.format(Number.isFinite(value) ? value : 0)} грн`
}

export function formatCompactCurrency(value: number): string {
  if (!Number.isFinite(value)) return '0 ₴'
  if (Math.abs(value) < 1_000) return `${integerFormatter.format(value)} ₴`

  return `${compactCurrencyFormatter.format(value)} ₴`
}

export function formatInteger(value: number): string {
  return integerFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatPercentage(value: number): string {
  return `${percentageFormatter.format(Number.isFinite(value) ? value : 0)}%`
}

export function formatDate(value: string | null): string {
  if (!value) return '—'

  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(date)
}

export function formatDateTime(value: string | null): string {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(date)
}

export function formatPeriodBucket(
  value: string,
  grain: AdminStatisticsGrain,
): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  if (grain === 'hour') {
    return new Intl.DateTimeFormat('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: TIME_ZONE,
    }).format(date)
  }

  if (grain === 'month') {
    return new Intl.DateTimeFormat('uk-UA', {
      month: 'short',
      year: '2-digit',
      timeZone: TIME_ZONE,
    }).format(date)
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'short',
    timeZone: TIME_ZONE,
  }).format(date)
}
