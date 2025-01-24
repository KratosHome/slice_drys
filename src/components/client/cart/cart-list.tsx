'use client'
import { useCartStore } from '@/components/client/cart/cartStore'
import CartProductCard from './cart-product-card'

export default function CartList() {
  const cart = useCartStore((state) => state.cart)

  return (
    <div className="flex">
      <div className="border-grey-200 flex flex-col border">
        <div className="ml-auto pb-5">Додано {cart.length} товарів</div>
        <div className="max-h-72 overflow-x-auto">
          {cart.map((product, index) => (
            <CartProductCard key={index} {...product} />
          ))}
        </div>
        <div className="flex justify-between">
          <div>ДО СПЛАТИ</div>
          <div>
            {cart.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            )}
            грн.
          </div>
        </div>
        <div
          className="cursor-pointer bg-green"
          onClick={useCartStore((state) => state.clearCart)}
        >
          CLEAR cart-list
        </div>
      </div>
    </div>
  )
}
