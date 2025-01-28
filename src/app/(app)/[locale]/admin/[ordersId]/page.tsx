import * as React from 'react'
import OrdersList from '@/components/admin/orders/orders-list'
import { getOrders } from '@/server/orders/get-orders'

function kebabToCamel(str: string): string {
  return str.replace(/-./g, (match) => match[1].toUpperCase())
}

export default async function ProductPage({
  params,
}: {
  params: { [key: string]: string }
}) {
  const { orders } = await getOrders(kebabToCamel(params.ordersId))
  return (
    <div>
      <OrdersList data={orders || []} />
    </div>
  )
}
