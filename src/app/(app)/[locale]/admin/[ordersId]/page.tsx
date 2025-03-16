import * as React from 'react'
import OrdersList from '@/components/admin/orders/orders-list'

export default async function ProductPage() {
  const dataOrders: IOrder[] = [
    {
      id: '1',
      status: 'new',
      products: [
        { id: '1', name: 'Product 1', count: 1, price: 100 },
        { id: '2', name: 'Product 2', count: 2, price: 200 },
      ],
      total: 300,
      user: {
        id: '1',
        name: 'Name',
        surname: 'Surname',
        phone: '+380939797910',
        email: 'example@example.com',
      },
      delivery: {
        city: 'Kyiv',
        department: 'Department 1',
        phone: '+380939797910',
      },
      payment: { method: 'cash' },
      comment: 'Some comment',
    },
    {
      id: '2',
      status: 'awaitingPayment',
      products: [{ id: '3', name: 'Product 3', count: 1, price: 150 }],
      total: 150,
      user: {
        id: '2',
        name: 'John',
        surname: 'Doe',
        phone: '380987654321',
        email: 'john.doe@example.com',
      },
      delivery: {
        city: 'Lviv',
        department: 'Department 5',
        phone: '380987654321',
      },
      payment: { method: 'card' },
      comment: 'Urgent delivery',
    },
  ]

  return (
    <div>
      <OrdersList data={dataOrders} />
    </div>
  )
}
