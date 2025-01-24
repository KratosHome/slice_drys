'use client'
import { useCartStore } from '@/components/client/cart/cartStore'
import CartProductCard from './cart-product-card'

export default function CartList() {
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
  const setFormData = useCartStore((state) => state.setFormData)

  const formDataExample = {
    name: 'Іван',
    surname: 'Петренко',
    phoneNumber: '+380501234567',
    email: 'ivan.petrenko@example.com',
    formStep: 1,
    deliveryInfo: 'Адреса доставки',
    paymentInfo: 'Інформація про оплату',
    comment: 'Це коментар',
    acceptTerms: true,
    noCall: false,
  }

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
        <div className="cursor-pointer bg-green" onClick={clearCart}>
          CLEAR cart-list
        </div>
      </div>
    </div>
  )
}
