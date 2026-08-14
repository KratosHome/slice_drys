'use client'

import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  ORDER_STATUS_BY_SLUG,
  type OrderStatusSlug,
} from '@/constants/order-status'
import { tabsOrder } from '@/data/tabs-order'
import type {
  AdminOrdersErrorResponse,
  AdminOrderStatusCountsResponse,
} from '@/types/admin-order'
import { cn } from '@/utils/cn'

const AUTO_REFRESH_INTERVAL = 30_000

async function fetchStatusCounts(): Promise<AdminOrderStatusCountsResponse> {
  const response = await fetch('/api/orders/get-status-count', {
    cache: 'no-store',
  })
  const payload = (await response.json()) as
    | AdminOrderStatusCountsResponse
    | AdminOrdersErrorResponse

  if (!response.ok || !payload.success) {
    throw new Error(
      'message' in payload
        ? payload.message
        : 'Не вдалося оновити кількість замовлень',
    )
  }

  return payload
}

export default function OrdersStatusTabs() {
  const locale = useLocale()
  const pathname = usePathname().replace(/\/$/, '')
  const searchParams = useSearchParams()
  const preservedParams = new URLSearchParams(searchParams.toString())
  preservedParams.delete('page')
  const preservedQuery = preservedParams.toString()
  const statusCountsQuery = useQuery({
    queryKey: ['admin', 'orders', 'status-counts'],
    queryFn: fetchStatusCounts,
    refetchInterval: AUTO_REFRESH_INTERVAL,
    refetchIntervalInBackground: false,
  })

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Замовлення</h1>
          <p className="text-muted-foreground text-xs">
            Дані та лічильники оновлюються автоматично.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => statusCountsQuery.refetch()}
          disabled={statusCountsQuery.isFetching}
          aria-label="Оновити кількість замовлень"
          title="Оновити кількість замовлень"
        >
          <RefreshCw
            className={cn(
              'size-4',
              statusCountsQuery.isFetching && 'animate-spin',
            )}
          />
        </Button>
      </div>

      <nav
        aria-label="Статуси замовлень"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8"
      >
        {tabsOrder.map((tab) => {
          const statusSlug = tab.value as OrderStatusSlug
          const baseHref = `/${locale}/admin/${statusSlug}`
          const href = preservedQuery
            ? `${baseHref}?${preservedQuery}`
            : baseHref
          const isActive = pathname === baseHref
          const orderStatus = ORDER_STATUS_BY_SLUG[statusSlug]
          const count = statusCountsQuery.data?.data[orderStatus] ?? 0

          return (
            <div key={statusSlug} className="relative h-24">
              <span
                className={cn(
                  'pointer-events-none absolute top-2 right-2 z-10 flex min-w-5 items-center justify-center rounded-full border px-1.5 py-0.5 text-[11px] leading-none font-semibold tabular-nums',
                  isActive
                    ? 'border-foreground/20 bg-foreground text-background'
                    : count > 0
                      ? 'border-foreground/20 bg-foreground text-background'
                      : 'border-border bg-background text-muted-foreground',
                )}
                aria-label={`${count} замовлень`}
              >
                {statusCountsQuery.isPending ? '…' : count}
              </span>

              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'focus-visible:ring-ring flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border px-2 py-2 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  isActive
                    ? 'border-foreground/25 bg-accent text-foreground ring-foreground/10 ring-1'
                    : 'border-border/70 bg-card/40 text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )}
              >
                <span className="flex w-full items-center justify-center">
                  {tab.icon}
                </span>
                <span className="flex min-h-10 items-center justify-center leading-5">
                  {tab.label}
                </span>
              </Link>
            </div>
          )
        })}
      </nav>

      {statusCountsQuery.isError ? (
        <p className="text-destructive mt-2 text-xs" role="status">
          Не вдалося оновити лічильники. Список замовлень залишається доступним.
        </p>
      ) : null}
    </>
  )
}
