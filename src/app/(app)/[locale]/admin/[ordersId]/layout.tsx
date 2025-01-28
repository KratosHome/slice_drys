'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { tabsOrder } from '@/data/tabs-order'
import { getOrders } from '@/server/orders/get-orders'

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ locale: LanguageType }>
}) {
  const [orders, setOrders] = useState<IOrder[] | []>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrders()
      setOrders(fetchedOrders.orders || [])
    }

    fetchOrders()
  }, [])

  const pathname = usePathname()

  const getNewOrders = orders.filter((order) => order.status === 'new')
  const getAwaitingPaymentOrders = orders.filter(
    (order) => order.status === 'awaitingPayment',
  )

  const getAwaitingShipmentOrders = orders.filter(
    (order) => order.status === 'awaitingShipment',
  )

  const getShippedOrders = orders.filter((order) => order.status === 'shipped')
  const getAwaitingReturnOrders = orders.filter(
    (order) => order.status === 'awaitingReturn',
  )

  const statusStyles: Record<string, string> = {
    new: 'bg-red text-white',
    'awaiting-payment': '!bg-amber-400 text-white',
    'awaiting-shipment': 'bg-blue-500 text-white',
    shipped: 'bg-green-500 text-whit e',
    'awaiting-return': 'bg-orange-500 text-white',
  }

  const orderCountByStatus: Record<string, number> = {
    new: getNewOrders.length,
    'awaiting-payment': getAwaitingPaymentOrders.length,
    'awaiting-shipment': getAwaitingShipmentOrders.length,
    shipped: getShippedOrders.length,
    'awaiting-return': getAwaitingReturnOrders.length,
  }
  return (
    <>
      <div className="flex flex-wrap justify-between gap-1 border-gray-300 bg-transparent">
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
                  className={`absolute -right-2 -top-2 flex size-6 items-center justify-center overflow-hidden rounded-full ${badgeStyles}`}
                >
                  {count}
                </div>
              )}

              <Link
                href={`${tab.value}`}
                className={`flex flex-col items-center gap-2 rounded-md border-[1px] border-black/30 px-2 py-1 ${
                  isActive ? 'border-black' : 'bg-transparent text-black'
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
      </div>
      <div>{children}</div>
    </>
  )
}
