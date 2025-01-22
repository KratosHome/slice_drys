'use client'
import { useCartStore } from '@/components/client/cart/cartStore'
import CartProductCard from './cart-product-card'

export default function CartList() {
  const cart = useCartStore((state) => state.cart)

  return (
    <div>
      {cart.map((product, index) => (
        <CartProductCard key={index} {...product}></CartProductCard>
      ))}
      <div
        className="cursor-pointer bg-green"
        onClick={useCartStore((state) => state.clearCart)}
      >
        CLEAR
      </div>
    </div>
  )
}
