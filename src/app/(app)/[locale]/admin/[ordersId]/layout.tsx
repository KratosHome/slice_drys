'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { tabsOrder } from '@/data/tabs-order'

interface StatusCountResponse {
  success: boolean
  data: {
    new?: number
    awaitingPayment?: number
    awaitingShipment?: number
    shipped?: number
    awaitingReturn?: number
    [key: string]: number | undefined
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; ordersId: string }>
}) {
  const pathname = usePathname()

  const [status, setStatus] = useState<StatusCountResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/orders/get-status-count')

        if (!res.ok) return

        const json = await res.json()
        setStatus(json)
      } catch {
        setStatus(null)
      }
    }

    fetchData()
  }, [])

  const statusStyles: Record<string, string> = {
    new: 'bg-red-500 text-white',
    'awaiting-payment': 'bg-amber-400 text-slate-950',
    'awaiting-shipment': 'bg-blue-500 text-white',
    shipped: 'bg-green-600 text-white',
    'awaiting-return': 'bg-orange-500 text-white',
  }

  const orderCountByStatus: Record<string, number> = {
    new: status?.data?.new || 0,
    'awaiting-payment': status?.data?.awaitingPayment || 0,
    'awaiting-shipment': status?.data?.awaitingShipment || 0,
    shipped: status?.data?.shipped || 0,
    'awaiting-return': status?.data?.awaitingReturn || 0,
  }

  return (
    <section className="px-4 pt-1 pb-8 sm:px-5">
      <nav
        aria-label="Статуси замовлень"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8"
      >
        {tabsOrder.map((tab) => {
          const isActive = pathname.includes(tab.value)
          const count = orderCountByStatus[tab.value] || 0
          const badgeStyles = statusStyles[tab.value] || ''

          return (
            <div
              key={tab.value}
              className="relative flex flex-col items-center"
            >
              {count > 0 && (
                <div
                  className={`border-background absolute -top-2 -right-2 z-10 flex size-6 items-center justify-center overflow-hidden rounded-full border-2 text-xs font-semibold ${badgeStyles}`}
                >
                  {count}
                </div>
              )}

              <Link
                href={`/uk/admin/${tab.value}`}
                aria-current={isActive ? 'page' : undefined}
                className={`focus-visible:ring-ring flex min-h-20 w-full flex-col items-center justify-center gap-2 rounded-lg border px-2 py-2 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                  isActive
                    ? 'border-foreground bg-foreground text-background shadow-sm'
                    : 'border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <div className="flex h-full w-full items-center justify-center">
                  {tab.icon}
                </div>
                <div>{tab.label}</div>
              </Link>
            </div>
          )
        })}
      </nav>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
