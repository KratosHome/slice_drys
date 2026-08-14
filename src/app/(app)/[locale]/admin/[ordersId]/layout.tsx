import { Suspense, type ReactNode } from 'react'

import OrdersStatusTabs from '@/components/admin/orders/orders-status-tabs'
import { Skeleton } from '@/components/ui/skeleton'

function OrdersStatusTabsFallback() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="size-9 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export default function OrdersStatusLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <section className="px-4 pt-1 pb-8 sm:px-5">
      <Suspense fallback={<OrdersStatusTabsFallback />}>
        <OrdersStatusTabs />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
