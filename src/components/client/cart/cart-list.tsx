'use client'
import { useCartStore } from '@/components/client/cart/cartStore'

export default function CartList() {
  const cart = useCartStore((state) => state.cart)
  return <div>{JSON.stringify(cart)}</div>
}
