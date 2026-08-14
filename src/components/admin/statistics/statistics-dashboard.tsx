'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  BadgeCheck,
  Boxes,
  CircleGauge,
  CircleX,
  ClipboardList,
  ExternalLink,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type CSSProperties, useCallback, useMemo, useTransition } from 'react'

import {
  ChartShell,
  EmptyChartState,
} from '@/components/admin/statistics/chart-shell'
import { PeriodControls } from '@/components/admin/statistics/period-controls'
import {
  SalesTrendChart,
  StatusBreakdownChart,
  TopProductsChart,
} from '@/components/admin/statistics/statistics-charts'
import { StatisticsDashboardSkeleton } from '@/components/admin/statistics/statistics-dashboard-skeleton'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatInteger,
  formatPercentage,
} from '@/components/admin/statistics/statistics-formatters'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DEFAULT_ADMIN_STATISTICS_PERIOD,
  isAdminStatisticsPeriod,
} from '@/constants/admin-statistics'
import type {
  AdminSalesStatistics,
  AdminSalesStatisticsErrorResponse,
  AdminSalesStatisticsResponse,
  AdminStatisticsBloggerPayouts,
  AdminStatisticsDataQuality,
  AdminStatisticsPaymentMethod,
  AdminStatisticsPeriod,
} from '@/types/admin-statistics'
import { cn } from '@/utils/cn'

const PAYMENT_LABELS: Record<AdminStatisticsPaymentMethod, string> = {
  card: 'Карткою',
  cash: 'Готівкою',
  COD: 'Післяплата',
  unknown: 'Не визначено',
}

const PERIOD_LABELS: Record<AdminStatisticsPeriod, string> = {
  all: 'За весь час',
  today: 'Сьогодні',
  '7d': 'Останні 7 днів',
  '30d': 'Останні 30 днів',
  '90d': 'Останні 90 днів',
  'this-year': 'Цей рік',
  custom: 'Власний період',
}

const STATISTICS_QUERY_KEY = ['admin', 'statistics'] as const

interface ClientStatisticsQuery {
  period: AdminStatisticsPeriod
  from: string
  to: string
}

interface StatisticsDashboardProps {
  initialData: AdminSalesStatistics
}

interface KpiCardProps {
  icon: LucideIcon
  label: string
  value: string
  description: string
}

function KpiCard({ icon: Icon, label, value, description }: KpiCardProps) {
  return (
    <article className="border-border bg-card min-w-0 rounded-xl border p-4 shadow-sm">
      <div className="text-muted-foreground flex items-center gap-2 text-xs leading-tight sm:text-sm">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
        {description}
      </p>
    </article>
  )
}

function CancellationSummary({ data }: { data: AdminSalesStatistics }) {
  return (
    <aside
      className="border-border bg-muted/20 mt-4 rounded-xl border p-4 sm:p-5"
      aria-labelledby="excluded-orders-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="excluded-orders-title"
            className="flex items-center gap-2 font-medium"
          >
            <CircleX
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            />
            Скасовані замовлення
          </h2>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
            Ці замовлення показані окремо й не входять до основних показників
            продажів, графіка, способів оплати та міст доставки.
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground text-xs">Замовлень</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">
            {formatInteger(data.summary.cancelledOrders)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Сума замовлень</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">
            {formatCurrency(data.summary.cancelledOrderValue)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">
            Товарів у скасованих
          </dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">
            {formatInteger(data.summary.cancelledUnits)}
          </dd>
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            {formatPercentage(data.summary.cancellationRate)} від усіх створених
          </p>
        </div>
      </dl>
    </aside>
  )
}

function getClientQuery(searchParams: URLSearchParams): ClientStatisticsQuery {
  const rawPeriod = searchParams.get('period')
  const period = isAdminStatisticsPeriod(rawPeriod)
    ? rawPeriod
    : DEFAULT_ADMIN_STATISTICS_PERIOD

  return {
    period,
    from: period === 'custom' ? (searchParams.get('from') ?? '') : '',
    to: period === 'custom' ? (searchParams.get('to') ?? '') : '',
  }
}

function buildStatisticsQueryString(query: ClientStatisticsQuery): string {
  const params = new URLSearchParams()

  if (query.period !== DEFAULT_ADMIN_STATISTICS_PERIOD) {
    params.set('period', query.period)
  }

  if (query.period === 'custom') {
    params.set('from', query.from)
    params.set('to', query.to)
  }

  return params.toString()
}

function initialDataMatchesQuery(
  initialData: AdminSalesStatistics,
  query: ClientStatisticsQuery,
): boolean {
  if (initialData.period.key !== query.period) return false
  if (query.period !== 'custom') return true

  return (
    initialData.period.from === query.from && initialData.period.to === query.to
  )
}

async function fetchStatistics(
  queryString: string,
): Promise<AdminSalesStatistics> {
  const response = await fetch(
    `/api/admin/statistics${queryString ? `?${queryString}` : ''}`,
    { cache: 'no-store' },
  )
  const payload = (await response.json()) as
    | AdminSalesStatisticsResponse
    | AdminSalesStatisticsErrorResponse

  if (!payload.success) throw new Error(payload.message)
  if (!response.ok) throw new Error('Не вдалося завантажити статистику.')

  return payload.data
}

function getPeriodDescription(data: AdminSalesStatistics): string {
  if (data.period.key === 'all') {
    if (!data.freshness.oldestOrderAt || !data.freshness.newestOrderAt) {
      return PERIOD_LABELS.all
    }

    return `${PERIOD_LABELS.all}: ${formatDate(data.freshness.oldestOrderAt)} — ${formatDate(data.freshness.newestOrderAt)}`
  }

  if (data.period.from && data.period.to) {
    return `${PERIOD_LABELS[data.period.key]}: ${formatDate(data.period.from)} — ${formatDate(data.period.to)}`
  }

  return PERIOD_LABELS[data.period.key]
}

function PaymentBreakdown({ data }: { data: AdminSalesStatistics }) {
  const visiblePaymentBreakdown = data.paymentBreakdown.filter(
    (item) => item.method !== 'unknown',
  )
  const totalOrders = visiblePaymentBreakdown.reduce(
    (sum, item) => sum + item.orders,
    0,
  )

  return (
    <ChartShell
      title="Способи оплати"
      description="Розподіл замовлень без скасованих."
    >
      {totalOrders === 0 ? (
        <EmptyChartState description="У вибраному періоді немає даних про способи оплати." />
      ) : (
        <ol className="space-y-5">
          {visiblePaymentBreakdown.map((item) => {
            const share = (item.orders / totalOrders) * 100

            return (
              <li key={item.method}>
                <div className="flex items-start justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium">{PAYMENT_LABELS[item.method]}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                      {formatCurrency(item.grossOrderValue)}
                    </p>
                  </div>
                  <p className="shrink-0 text-right tabular-nums">
                    {formatInteger(item.orders)}{' '}
                    <span className="text-muted-foreground text-xs">
                      ({formatPercentage(share)})
                    </span>
                  </p>
                </div>
                <div
                  className="bg-muted mt-2 h-2 overflow-hidden rounded-full"
                  role="img"
                  aria-label={`${PAYMENT_LABELS[item.method]}: ${formatPercentage(share)}`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(Math.max(share, 0), 100)}%`,
                      backgroundColor: 'var(--statistics-chart-primary)',
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </ChartShell>
  )
}

function TopCities({ data }: { data: AdminSalesStatistics }) {
  return (
    <ChartShell
      title="Міста доставки"
      description="Найчастіші міста серед замовлень без скасованих."
      contentClassName="p-0 sm:p-0"
    >
      {data.topCities.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyChartState description="У вибраному періоді немає замовлень із визначеним містом доставки." />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 sm:pl-5">Місто</TableHead>
              <TableHead className="text-right">Замовлення</TableHead>
              <TableHead className="pr-4 text-right sm:pr-5">
                Сума замовлень
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.topCities.map((item) => (
              <TableRow key={item.city}>
                <TableCell className="max-w-48 truncate pl-4 font-medium sm:pl-5">
                  {item.city || 'Не визначено'}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatInteger(item.orders)}
                </TableCell>
                <TableCell className="pr-4 text-right tabular-nums sm:pr-5">
                  {formatCurrency(item.grossOrderValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </ChartShell>
  )
}

function getSafeLink(value: string | null): string | null {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.toString()
      : null
  } catch {
    return null
  }
}

function BloggerPayouts({
  data,
  completedOrders,
}: {
  data: AdminStatisticsBloggerPayouts
  completedOrders: number
}) {
  const knownPayouts = data.items
    .map((item) => item.accruedPayout)
    .filter((value): value is number => value !== null)
  const accruedTotal = knownPayouts.reduce((sum, value) => sum + value, 0)
  const coverageLabel =
    completedOrders === 0
      ? 'Немає виконаних замовлень'
      : data.coverage === 'complete'
        ? 'Повне покриття'
        : data.coverage === 'partial'
          ? 'Часткове покриття'
          : 'Покриття недоступне'
  const coverageDescription =
    data.note ??
    (completedOrders === 0
      ? 'У вибраному періоді немає виконаних замовлень, тому покриття й нарахування не розраховуються.'
      : data.coverage === 'complete'
        ? 'Усі виконані замовлення періоду мають достатні дані для атрибуції.'
        : data.coverage === 'partial'
          ? 'Частина виконаних замовлень не містить збереженої атрибуції або ставки.'
          : 'У виконаних замовленнях немає достатніх даних для надійного розрахунку виплат.')

  return (
    <ChartShell
      title="Нараховано до виплати блогерам"
      description="Лише виконані замовлення з відстеженою атрибуцією та зафіксованою ставкою."
      contentClassName="p-0 sm:p-0"
      action={
        <div className="text-right">
          <p className="text-muted-foreground text-xs">Разом</p>
          <p className="mt-1 font-semibold tabular-nums">
            {knownPayouts.length > 0 ? formatCurrency(accruedTotal) : '—'}
          </p>
        </div>
      }
    >
      <div className="border-border bg-muted/30 m-4 rounded-lg border p-3 sm:m-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <TriangleAlert className="size-4" aria-hidden="true" />
            {coverageLabel}
          </p>
          <p className="text-muted-foreground text-xs tabular-nums">
            Відстежено виконаних: {formatInteger(data.trackedOrders)} ·
            реферальних: {formatInteger(data.attributedOrders)}
          </p>
        </div>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          {coverageDescription}
          {data.trackingStartedAt
            ? ` Перше відстежене замовлення в періоді: ${formatDate(data.trackingStartedAt)}.`
            : ''}
          {data.legacyOrdersWithoutAttribution > 0
            ? ` Виконаних без атрибуції: ${formatInteger(data.legacyOrdersWithoutAttribution)}.`
            : ''}
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <EmptyChartState description="Немає блогерів із нарахуваннями, які можна надійно показати за цей період." />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 sm:pl-5">Блогер</TableHead>
              <TableHead className="text-right">Поточна ставка</TableHead>
              <TableHead className="text-right">Виконано</TableHead>
              <TableHead className="text-right">Сума виконаних</TableHead>
              <TableHead className="pr-4 text-right sm:pr-5">
                До виплати
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => {
              const safeLink = getSafeLink(item.link)

              return (
                <TableRow key={item.code}>
                  <TableCell className="pl-4 sm:pl-5">
                    <div className="min-w-36">
                      <p className="font-medium">{item.name || item.code}</p>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-1 font-mono text-xs">
                        <span>{item.code}</span>
                        {safeLink ? (
                          <a
                            href={safeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-foreground focus-visible:ring-ring rounded-sm focus-visible:ring-1 focus-visible:outline-none"
                            aria-label={`Відкрити посилання блогера ${item.name || item.code}`}
                          >
                            <ExternalLink
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <p>{formatPercentage(item.interestPercent)}</p>
                    {item.effectiveInterestPercent !== null &&
                    item.effectiveInterestPercent !== item.interestPercent ? (
                      <p className="text-muted-foreground mt-0.5 text-xs whitespace-nowrap">
                        у нарахуваннях{' '}
                        {formatPercentage(item.effectiveInterestPercent)}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.completedOrders === null
                      ? '—'
                      : formatInteger(item.completedOrders)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.completedOrderValue === null
                      ? '—'
                      : formatCurrency(item.completedOrderValue)}
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium tabular-nums sm:pr-5">
                    {item.accruedPayout === null
                      ? '—'
                      : formatCurrency(item.accruedPayout)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </ChartShell>
  )
}

function DataQualityNotice({ data }: { data: AdminStatisticsDataQuality }) {
  const issues = [
    ['Некоректний статус', data.invalidStatusOrders],
    ['Некоректна сума замовлення', data.invalidTotalOrders],
    ['Некоректна дата створення', data.missingOrInvalidCreatedAtOrders],
    ['Некоректні товарні позиції', data.invalidProductLines],
    ['Невідомий спосіб оплати', data.unknownPaymentOrders],
    ['Місто не визначено', data.missingCityOrders],
    ['Немає ставки блогера', data.referralOrdersMissingRate],
    [
      'Розбіжність суми товарних позицій',
      data.completedOrdersWithLineTotalMismatch,
    ],
  ] as const
  const reconciliationIssues = Object.entries(data.reconciliation).filter(
    ([, value]) => value !== 0,
  )
  const visibleIssues = issues.filter(([, value]) => value > 0)

  if (visibleIssues.length === 0 && reconciliationIssues.length === 0) {
    return null
  }

  return (
    <aside
      className="border-border bg-muted/30 mt-4 rounded-xl border p-4"
      aria-label="Застереження щодо якості даних"
    >
      <div className="flex items-start gap-3">
        <TriangleAlert
          className="text-muted-foreground mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium">Є обмеження якості даних</p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            Окремі розрізи можуть не охоплювати всі замовлення. Підсумкові суми
            не замінюють платіжну звітність.
          </p>
          <ul className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {visibleIssues.map(([label, value]) => (
              <li key={label}>
                {label}:{' '}
                <span className="tabular-nums">{formatInteger(value)}</span>
              </li>
            ))}
            {reconciliationIssues.map(([label, value]) => (
              <li key={label}>
                Розбіжність {label}:{' '}
                <span className="tabular-nums">{formatInteger(value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default function StatisticsDashboard({
  initialData,
}: StatisticsDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigationPending, startNavigation] = useTransition()
  const clientQuery = useMemo(
    () => getClientQuery(new URLSearchParams(searchParams.toString())),
    [searchParams],
  )
  const queryString = useMemo(
    () => buildStatisticsQueryString(clientQuery),
    [clientQuery],
  )
  const canUseInitialData = initialDataMatchesQuery(initialData, clientQuery)
  const statisticsQuery = useQuery<AdminSalesStatistics, Error>({
    queryKey: [
      ...STATISTICS_QUERY_KEY,
      clientQuery.period,
      clientQuery.from,
      clientQuery.to,
    ],
    queryFn: () => fetchStatistics(queryString),
    initialData: canUseInitialData ? initialData : undefined,
    initialDataUpdatedAt: canUseInitialData
      ? Date.parse(initialData.freshness.generatedAt)
      : undefined,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })

  const navigateToPeriod = useCallback(
    (period: AdminStatisticsPeriod, from = '', to = '') => {
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete('period')
      nextParams.delete('from')
      nextParams.delete('to')

      if (period !== DEFAULT_ADMIN_STATISTICS_PERIOD) {
        nextParams.set('period', period)
      }

      if (period === 'custom') {
        nextParams.set('from', from)
        nextParams.set('to', to)
      }

      const nextQueryString = nextParams.toString()
      const href = nextQueryString ? `${pathname}?${nextQueryString}` : pathname

      startNavigation(() => router.replace(href, { scroll: false }))
    },
    [pathname, router, searchParams],
  )

  const data = statisticsQuery.data

  if (!data && statisticsQuery.isPending) {
    return <StatisticsDashboardSkeleton />
  }

  if (!data) {
    return (
      <div
        className="border-destructive/40 bg-destructive/5 rounded-xl border p-5"
        role="alert"
      >
        <h2 className="font-medium">Не вдалося завантажити статистику</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {statisticsQuery.error?.message ?? 'Спробуйте повторити запит.'}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void statisticsQuery.refetch()}
        >
          Спробувати ще раз
        </Button>
      </div>
    )
  }

  const rootStyle = {
    '--statistics-chart-primary': 'hsl(var(--sidebar-ring))',
    '--statistics-chart-secondary': 'hsl(var(--chart-2))',
  } as CSSProperties

  return (
    <div style={rootStyle} aria-busy={isNavigationPending}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Продажі та виплати
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {getPeriodDescription(data)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Оновлено {formatDateTime(data.freshness.generatedAt)} · джерело:
            жива база замовлень
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="self-start lg:self-auto"
          disabled={statisticsQuery.isFetching}
          onClick={() => void statisticsQuery.refetch()}
        >
          <RefreshCw
            className={cn(
              'size-4',
              statisticsQuery.isFetching && 'animate-spin',
            )}
            aria-hidden="true"
          />
          {statisticsQuery.isFetching ? 'Оновлення…' : 'Оновити'}
        </Button>
      </div>

      <div className="border-border bg-card mt-5 rounded-xl border p-4 shadow-sm sm:p-5">
        <PeriodControls
          key={`${clientQuery.period}:${clientQuery.from}:${clientQuery.to}`}
          period={clientQuery.period}
          from={clientQuery.from}
          to={clientQuery.to}
          isPending={isNavigationPending}
          onPeriodChange={(period) => navigateToPeriod(period)}
          onCustomApply={(from, to) => navigateToPeriod('custom', from, to)}
        />
      </div>

      <div className="sr-only" aria-live="polite">
        {statisticsQuery.isFetching
          ? 'Статистика оновлюється.'
          : 'Статистику оновлено.'}
      </div>

      {statisticsQuery.error ? (
        <div
          className="border-destructive/40 bg-destructive/5 mt-4 rounded-lg border px-4 py-3 text-sm"
          role="alert"
        >
          Показано останні доступні дані. Не вдалося оновити:{' '}
          {statisticsQuery.error.message}
        </div>
      ) : null}

      <div
        className={cn(
          'mt-4 transition-opacity',
          statisticsQuery.isPlaceholderData && 'opacity-65',
        )}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
          <KpiCard
            icon={ClipboardList}
            label="Замовлення"
            value={formatInteger(data.summary.orders)}
            description={`Без скасованих · усього створено: ${formatInteger(data.summary.totalCreatedOrders)}`}
          />
          <KpiCard
            icon={ReceiptText}
            label="Сума замовлень"
            value={formatCurrency(data.summary.grossOrderValue)}
            description="Скасовані не враховані"
          />
          <KpiCard
            icon={BadgeCheck}
            label="Виконано на суму"
            value={formatCurrency(data.summary.completedOrderValue)}
            description={`${formatInteger(data.summary.completedOrders)} виконаних замовлень`}
          />
          <KpiCard
            icon={CircleGauge}
            label="Середній чек виконаних"
            value={formatCurrency(data.summary.averageCompletedOrderValue)}
            description="Лише поточний статус «Виконано»"
          />
          <KpiCard
            icon={Boxes}
            label="Товарів замовлено"
            value={formatInteger(data.summary.unitsOrdered)}
            description={`У виконаних: ${formatInteger(data.summary.unitsCompleted)}`}
          />
          <KpiCard
            icon={PackageCheck}
            label="Частка виконаних"
            value={formatPercentage(data.summary.completionRate)}
            description="Від замовлень без скасованих"
          />
        </div>

        <CancellationSummary data={data} />

        <div className="mt-4">
          <SalesTrendChart data={data.timeSeries} grain={data.period.grain} />
        </div>

        <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
          <StatusBreakdownChart data={data.statusBreakdown} />
          <TopProductsChart data={data.topProducts.items} />
          <PaymentBreakdown data={data} />
          <TopCities data={data} />
        </div>

        <div className="mt-4">
          <BloggerPayouts
            data={data.bloggerPayouts}
            completedOrders={data.summary.completedOrders}
          />
        </div>

        <DataQualityNotice data={data.dataQuality} />
      </div>
    </div>
  )
}
