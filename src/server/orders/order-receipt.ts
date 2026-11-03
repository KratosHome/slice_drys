export interface ReceiptOrder {
  _id: { toString(): string }
  total: number
  products: Array<{
    id: string
    name: string
    weight: number
    price: number
    count: number
  }>
}

export function getOrderReceipt(order: ReceiptOrder): IOrderReceipt {
  return {
    transactionId: order._id.toString(),
    currency: 'UAH',
    value: order.total,
    items: order.products.map((product) => ({
      id: product.id,
      name: product.name,
      weight: product.weight,
      price: product.price,
      quantity: product.count,
    })),
  }
}
