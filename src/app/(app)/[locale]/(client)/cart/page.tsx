import Cart from '@/components/client/cart/cart'

import { createOrder } from '@/server/orders/create-order'

const orderData = {
  id: '12345',
  status: 'new',
  products: [
    {
      id: '001',
      name: 'Product A',
      count: 2,
      price: 100.0,
    },
    {
      id: '002',
      name: 'Product B',
      count: 1,
      price: 200.0,
    },
  ],
  total: 400.0,
  user: {
    id: 'user123',
    name: 'Іван',
    surname: 'Іваненко',
    phone: '+380123456789',
    email: 'ivan.ivanenko@example.com',
  },
  delivery: {
    city: 'Київ',
    department: 'Департамент №1',
    phone: '+380987654321',
  },
  payment: {
    method: 'Credit Card',
  },
  comment: 'Будь ласка, доставити до п’ятниці',
}

export default async function CartPage() {
  createOrder(orderData)
  //props: { params: Params }) {
  // const { locale } = await props.params

  return (
    <div>
      <div className="flex">
        <Cart />
      </div>
    </div>
  )
}
