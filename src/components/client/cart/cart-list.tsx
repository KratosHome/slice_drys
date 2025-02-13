'use client'
import { useCartStore } from '@/store/cartStore'
import CartProductCard from './cart-product-card'

export default function CartList() {
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)

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
            {cart.itemList?.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            )}
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
