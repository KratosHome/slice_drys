'use client'

import OrderProductCard from './order-product-card'

import { useCartStore } from '@/store/cartStore'

export default function CartList() {
  const { cart, totalPrice, clearCart } = useCartStore((state) => state)

  return (
    <div className="flex w-full overflow-y-scroll">
      <div className="border-grey-200 flex w-full flex-col border">
        <div className="ml-auto pb-5">
          Додано {cart.itemList?.length} товарів
        </div>

        <div className="max-h-72 overflow-x-auto">
          {cart.itemList?.map((product, index) => (
            <OrderProductCard key={index} {...product} />
          ))}
        </div>

        <div className="flex justify-between">
          <div>ДО СПЛАТИ</div>

          <div>
            {totalPrice}
            грн.
          </div>
        </div>

        <div className="bg-green cursor-pointer" onClick={clearCart}>
          CLEAR cart
        </div>
      </div>
    </div>
  )
}
