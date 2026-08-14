import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import OrdersList from '@/components/admin/orders/orders-list'
import { Skeleton } from '@/components/ui/skeleton'
import { parseAdminOrdersQuery } from '@/constants/admin-orders-query'
import { getOrderStatusFromSlug } from '@/constants/order-status'
import { ApiError } from '@/server/api-error.server'
import { getAdminOrders } from '@/server/orders/get-order.server'

interface OrdersPageProps {
  params: Promise<{ locale: string; ordersId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function OrdersListFallback() {
  return (
    <div className="border-border bg-card mt-6 space-y-3 rounded-xl border p-4">
      <Skeleton className="h-9 w-full max-w-xl" />
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  )
}

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const { ordersId } = await params
  const rawSearchParams = await searchParams
  const status = getOrderStatusFromSlug(ordersId)
  const query = parseAdminOrdersQuery((name) => {
    const value = rawSearchParams[name]
    return Array.isArray(value) ? value[0] : value
  })

  if (!status) notFound()

  let result: Awaited<ReturnType<typeof getAdminOrders>>

  try {
    result = await getAdminOrders({
      status,
      ...query,
    })
  } catch (error) {
    // The admin layout renders the login/access-denied state. Child Server
    // Components can execute in parallel with it, so auth errors are expected.
    if (
      error instanceof ApiError &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      return null
    }

    throw error
  }

  return (
    <Suspense fallback={<OrdersListFallback />}>
      <OrdersList
        key={status}
        status={status}
        initialData={{ success: true, ...result }}
        initialQuery={query}
      />
    </Suspense>
  )
}
