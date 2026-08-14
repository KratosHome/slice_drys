import { BarChart3, CheckCircle2, ClipboardList, Clock3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '@/constants/order-status'
import { requireAdminPagePermission } from '@/server/auth/require-admin-page.server'
import { getOrderStatusCounts } from '@/server/orders/get-status-order.server'

interface StatisticsPageProps {
  params: Promise<{ locale: string }>
}

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: number
}

const ACTIVE_STATUSES: readonly OrderStatus[] = [
  'new',
  'awaitingPayment',
  'awaitingShipment',
  'shipped',
  'awaitingReturn',
]

function SummaryCard({ icon: Icon, label, value }: SummaryCardProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-5 shadow-sm">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Icon className="size-4" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

export default async function StatisticsPage({ params }: StatisticsPageProps) {
  const { locale } = await params
  const identity = await requireAdminPagePermission(locale, 'statistics:read')

  if (!identity) return null

  const counts = await getOrderStatusCounts()
  const total = ORDER_STATUSES.reduce((sum, status) => sum + counts[status], 0)
  const active = ACTIVE_STATUSES.reduce(
    (sum, status) => sum + counts[status],
    0,
  )
  const completed = counts.completed

  return (
    <section className="px-4 py-6 sm:px-5">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Статистика замовлень
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Актуальний розподіл замовлень за статусами.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <SummaryCard icon={ClipboardList} label="Усього" value={total} />
        <SummaryCard icon={Clock3} label="В роботі" value={active} />
        <SummaryCard icon={CheckCircle2} label="Виконано" value={completed} />
      </div>

      <div className="border-border bg-card mt-5 rounded-xl border shadow-sm">
        <div className="border-border flex items-center gap-2 border-b px-5 py-4">
          <BarChart3
            className="text-muted-foreground size-4"
            aria-hidden="true"
          />
          <h2 className="font-medium">За статусами</h2>
        </div>
        <dl className="divide-border grid divide-y sm:grid-cols-2 sm:divide-y-0">
          {ORDER_STATUSES.map((status) => (
            <div
              key={status}
              className="border-border flex items-center justify-between gap-4 px-5 py-3 sm:border-b sm:odd:border-r"
            >
              <dt className="text-muted-foreground text-sm">
                {ORDER_STATUS_LABELS[status]}
              </dt>
              <dd className="font-medium tabular-nums">{counts[status]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
