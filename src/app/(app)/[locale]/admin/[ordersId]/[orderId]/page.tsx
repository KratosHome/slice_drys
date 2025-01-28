import { getOrders } from '@/server/orders/get-orders'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const { success, orders, message } = await getOrders(undefined, orderId)

  if (!success) {
    return (
      <div className="bg-red-100 p-4 text-red-800">
        <h1>Error: {message}</h1>
      </div>
    )
  }

  const order = orders
    ? orders[0]
    : {
        id: '',
        status: 'new',
        products: [],
        total: 0,
        user: {
          id: '',
          name: '',
          surname: '',
          phone: '',
          email: '',
        },
        delivery: {
          city: '',
          department: '',
          phone: '',
        },
        payment: {
          method: 'cash',
        },
        comment: '',
      }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Order ID: {order.id}</h1>
      <p>Status: {order.status}</p>
      <h2 className="mt-4 font-semibold">Products:</h2>
      <ul className="list-disc pl-5">
        {order.products.map(
          (product: {
            id: string
            name: string
            count: number
            price: number
          }) => (
            <li key={product.id}>
              Name: {product.name}, Count: {product.count}, Price:{' '}
              {product.price}
            </li>
          ),
        )}
      </ul>
      <p className="mt-4">Total: {order.total}</p>
      <h2 className="mt-4 font-semibold">User:</h2>
      <p>
        Name: {order.user.name} {order.user.surname}
      </p>
      <p>Phone: {order.user.phone}</p>
      <p>Email: {order.user.email}</p>
      <h2 className="mt-4 font-semibold">Delivery:</h2>
      <p>City: {order.delivery.city}</p>
      <p>Department: {order.delivery.department}</p>
      <p>Phone: {order.delivery.phone}</p>
      <h2 className="mt-4 font-semibold">Payment:</h2>
      <p>Method: {order.payment.method}</p>
      <p>Comment: {order.comment}</p>
    </div>
  )
}
