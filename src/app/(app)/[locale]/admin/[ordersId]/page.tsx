import * as React from 'react'
import OrdersList from '@/components/admin/orders/orders-list'
import { getOrders } from '@/server/orders/get-orders'

export default async function ProductPage() {
  const { orders } = await getOrders()

  return (
    <div>
      <OrdersList data={orders || []} />
    </div>
  )
}
