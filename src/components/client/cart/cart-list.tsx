'use client'
import { useCartStore } from '@/components/client/cart/cartStore'
import CartProductCard from './cart-product-card'

export default function CartList() {
  const cart = useCartStore((state) => state.cart)

  return (
    <div className="border-grey-200 flex flex-col border">
      <div className="bg-black text-center text-white">
        {' '}
        Перегляд замовлення
      </div>

      <div className="ml-auto pb-5">Додано {cart.length} товарів</div>
      <div className="max-h-72 overflow-x-auto">
        {cart.map((product, index) => (
          <CartProductCard key={index} {...product}></CartProductCard>
        ))}
      </div>
      <div className="flex justify-between">
        <div>ДО СПЛАТИ</div>
        <div>
          {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          грн.
        </div>
      </div>
      <div
        className="cursor-pointer bg-green"
        onClick={useCartStore((state) => state.clearCart)}
      >
        CLEAR cart
      </div>
      <div className="mx-auto mt-3 cursor-pointer bg-black p-2 text-center text-white">
        Оформити замовлення
      </div>
    </div>
  )
}
