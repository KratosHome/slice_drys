'use client'

import CartProductCard from './cart-product-card'

import { useCartStore } from '@/store/cartStore'

export default function CartList() {
  const { cart, totalPrice, clearCart } = useCartStore((state) => state)

  return (
    <div className="flex">
      <div className="border-grey-200 flex flex-col border">
        <div className="ml-auto pb-5">
          Додано {cart.itemList?.length} товарів
        </div>

        <div className="max-h-72 overflow-x-auto">
          {cart.itemList?.map((product, index) => (
            <CartProductCard key={index} {...product} />
          ))}
        </div>

        <div className="flex justify-between">
          <div>ДО СПЛАТИ</div>

          <div>
            {totalPrice}
            грн.
          </div>
        </div>

        <div className="bg-green·cursor-pointer" onClick={clearCart}>
          CLEAR cart
        </div>
      </div>
    </div>
  )
}
