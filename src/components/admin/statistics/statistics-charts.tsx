'use client'

import type { TooltipContentProps } from 'recharts'
import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartShell,
  EmptyChartState,
} from '@/components/admin/statistics/chart-shell'
import {
  formatCompactCurrency,
  formatCurrency,
  formatInteger,
  formatPeriodBucket,
} from '@/components/admin/statistics/statistics-formatters'
import { ORDER_STATUS_LABELS } from '@/constants/order-status'
import type {
  AdminStatisticsGrain,
  AdminStatisticsStatusBucket,
  AdminStatisticsTimePoint,
  AdminStatisticsTopProduct,
} from '@/types/admin-statistics'

const PRIMARY_COLOR = 'var(--statistics-chart-primary)'
const SECONDARY_COLOR = 'var(--statistics-chart-secondary)'
const GRID_COLOR = 'hsl(var(--border))'
const AXIS_COLOR = 'hsl(var(--muted-foreground))'

interface TrendDatum extends AdminStatisticsTimePoint {
  label: string
}

interface StatusDatum extends AdminStatisticsStatusBucket {
  label: string
}

interface ProductDatum extends AdminStatisticsTopProduct {
  label: string
}

function TooltipCard({ children }: { children: ReactNode }) {
  return (
    <div className="border-border bg-popover text-popover-foreground min-w-48 rounded-lg border p-3 text-xs shadow-lg">
      {children}
    </div>
  )
}

function TrendTooltip({ active, payload }: TooltipContentProps) {
  const point = payload[0]?.payload as TrendDatum | undefined

  if (!active || !point) return null

  return (
    <TooltipCard>
      <p className="font-medium">{point.label}</p>
      <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-5 gap-y-1.5">
        <dt className="text-muted-foreground">Замовлення</dt>
        <dd className="text-right tabular-nums">
          {formatInteger(point.orders)}
        </dd>
        <dt className="text-muted-foreground">Сума без скасованих</dt>
        <dd className="text-right tabular-nums">
          {formatCurrency(point.grossOrderValue)}
        </dd>
        <dt className="text-muted-foreground">Виконано</dt>
        <dd className="text-right tabular-nums">
          {formatInteger(point.completedOrders)}
        </dd>
        <dt className="text-muted-foreground">Виконано на суму</dt>
        <dd className="text-right tabular-nums">
          {formatCurrency(point.completedOrderValue)}
        </dd>
      </dl>
    </TooltipCard>
  )
}

function StatusTooltip({ active, payload }: TooltipContentProps) {
  const item = payload[0]?.payload as StatusDatum | undefined

  if (!active || !item) return null

  return (
    <TooltipCard>
      <p className="font-medium">{item.label}</p>
      <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-5 gap-y-1.5">
        <dt className="text-muted-foreground">Замовлення</dt>
        <dd className="text-right tabular-nums">
          {formatInteger(item.orders)}
        </dd>
        <dt className="text-muted-foreground">Сума</dt>
        <dd className="text-right tabular-nums">
          {formatCurrency(item.grossOrderValue)}
        </dd>
      </dl>
    </TooltipCard>
  )
}

function ProductTooltip({ active, payload }: TooltipContentProps) {
  const item = payload[0]?.payload as ProductDatum | undefined

  if (!active || !item) return null

  return (
    <TooltipCard>
      <p className="max-w-64 font-medium whitespace-normal">{item.name}</p>
      <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-5 gap-y-1.5">
        <dt className="text-muted-foreground">Кількість</dt>
        <dd className="text-right tabular-nums">
          {formatInteger(item.quantity)}
        </dd>
        <dt className="text-muted-foreground">Виконано на суму</dt>
        <dd className="text-right tabular-nums">
          {formatCurrency(item.completedValue)}
        </dd>
      </dl>
    </TooltipCard>
  )
}

function shortenLabel(value: string, maximum = 22): string {
  return value.length > maximum ? `${value.slice(0, maximum - 1)}…` : value
}

interface SalesTrendChartProps {
  data: AdminStatisticsTimePoint[]
  grain: AdminStatisticsGrain
}

export function SalesTrendChart({ data, grain }: SalesTrendChartProps) {
  const rows: TrendDatum[] = data.map((point) => ({
    ...point,
    label: formatPeriodBucket(point.periodStart, grain),
  }))
  const hasData = rows.some(
    (point) => point.orders > 0 || point.grossOrderValue > 0,
  )
  const useBars = rows.length < 8

  return (
    <ChartShell
      title="Сума замовлень у часі"
      description="Без скасованих; виконані замовлення — підмножина. Групування відбувається за датою створення."
      contentClassName="pt-3"
    >
      {!hasData ? (
        <EmptyChartState description="У вибраному періоді немає замовлень для побудови динаміки." />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-0.5 w-7"
                style={{ backgroundColor: PRIMARY_COLOR }}
                aria-hidden="true"
              />
              <span>Сума без скасованих</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-0 w-7 border-t-2 border-dashed"
                style={{ borderColor: SECONDARY_COLOR }}
                aria-hidden="true"
              />
              <span>Виконано на суму</span>
            </div>
          </div>

          <div className="h-[19rem] w-full sm:h-[22rem]">
            <ResponsiveContainer width="100%" height="100%">
              {useBars ? (
                <BarChart
                  data={rows}
                  margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
                  accessibilityLayer
                >
                  <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: GRID_COLOR }}
                    minTickGap={20}
                  />
                  <YAxis
                    width={64}
                    tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) =>
                      formatCompactCurrency(value)
                    }
                  />
                  <Tooltip
                    content={TrendTooltip}
                    cursor={{ fill: GRID_COLOR }}
                  />
                  <Bar
                    dataKey="grossOrderValue"
                    name="Сума без скасованих"
                    fill={PRIMARY_COLOR}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="completedOrderValue"
                    name="Виконано на суму"
                    fill={SECONDARY_COLOR}
                    fillOpacity={0.42}
                    stroke={SECONDARY_COLOR}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={rows}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  accessibilityLayer
                >
                  <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: GRID_COLOR }}
                    minTickGap={24}
                  />
                  <YAxis
                    width={64}
                    domain={[0, 'auto']}
                    tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) =>
                      formatCompactCurrency(value)
                    }
                  />
                  <Tooltip
                    content={TrendTooltip}
                    cursor={{ stroke: GRID_COLOR }}
                  />
                  <Line
                    type="monotone"
                    dataKey="grossOrderValue"
                    name="Сума без скасованих"
                    stroke={PRIMARY_COLOR}
                    strokeWidth={2}
                    dot={rows.length <= 18}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completedOrderValue"
                    name="Виконано на суму"
                    stroke={SECONDARY_COLOR}
                    strokeWidth={2}
                    strokeDasharray="6 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <ul className="sr-only">
            {rows.map((point) => (
              <li key={point.periodStart}>
                {point.label}: {formatInteger(point.orders)} замовлень на{' '}
                {formatCurrency(point.grossOrderValue)}; виконано на{' '}
                {formatCurrency(point.completedOrderValue)}.
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartShell>
  )
}

interface StatusBreakdownChartProps {
  data: AdminStatisticsStatusBucket[]
}

export function StatusBreakdownChart({ data }: StatusBreakdownChartProps) {
  const rows: StatusDatum[] = data.map((item) => ({
    ...item,
    label: ORDER_STATUS_LABELS[item.status],
  }))
  const hasData = rows.some((item) => item.orders > 0)

  return (
    <ChartShell
      title="Замовлення за статусами"
      description="Усі статуси, включно зі скасованими, у порядку життєвого циклу."
    >
      {!hasData ? (
        <EmptyChartState description="У вибраному періоді немає замовлень зі збереженим статусом." />
      ) : (
        <>
          <div className="h-[20rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={rows}
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  domain={[0, 'auto']}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={112}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) => shortenLabel(value, 18)}
                />
                <Tooltip
                  content={StatusTooltip}
                  cursor={{ fill: GRID_COLOR }}
                />
                <Bar
                  dataKey="orders"
                  name="Замовлення"
                  fill={PRIMARY_COLOR}
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="sr-only">
            {rows.map((item) => (
              <li key={item.status}>
                {item.label}: {formatInteger(item.orders)} замовлень на{' '}
                {formatCurrency(item.grossOrderValue)}.
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartShell>
  )
}

interface TopProductsChartProps {
  data: AdminStatisticsTopProduct[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const rows: ProductDatum[] = data.map((item) => ({
    ...item,
    label: shortenLabel(item.name || 'Без назви'),
  }))
  const hasData = rows.some(
    (item) => item.completedValue > 0 || item.quantity > 0,
  )

  return (
    <ChartShell
      title="Топ товарів у виконаних замовленнях"
      description="Популярність за кількістю проданих одиниць; сума доступна у підказці."
    >
      {!hasData ? (
        <EmptyChartState description="У вибраному періоді немає виконаних замовлень із товарами." />
      ) : (
        <>
          <div className="h-[20rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={rows}
                margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 'auto']}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickFormatter={(value: number) => formatInteger(value)}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={118}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={ProductTooltip}
                  cursor={{ fill: GRID_COLOR }}
                />
                <Bar
                  dataKey="quantity"
                  name="Продано одиниць"
                  fill={SECONDARY_COLOR}
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="sr-only">
            {rows.map((item) => (
              <li key={`${item.productId ?? 'unknown'}-${item.name}`}>
                {item.name}: {formatInteger(item.quantity)} одиниць на{' '}
                {formatCurrency(item.completedValue)}.
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartShell>
  )
}
