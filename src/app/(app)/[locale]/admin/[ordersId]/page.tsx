import * as React from 'react'
import OrdersList from '@/components/admin/orders/orders-list'
import { getOrders } from '@/server/orders/get-orders'

export default async function ProductPage({
  params,
}: {
  params: { ordersId: string }
}) {
  const { orders } = await getOrders(params.ordersId)

  return (
    <div>
      <OrdersList data={orders || []} />
    </div>
  )
}
