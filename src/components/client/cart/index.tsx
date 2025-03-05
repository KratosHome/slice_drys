'use client'

import CartForm from '@/components/client/cart/cart-form'
import CartList from '@/components/client/cart/cart-list'

import { useRef } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Cart() {
  const formRef = useRef<HTMLFormElement>(null)
  const submitOrder = useCartStore((state) => state.submitOrder)

  const handleSubmit = async () => {
    if (formRef.current) formRef.current.submit()

    const response: IResponse = await submitOrder()

    if (response.success) {
      alert('Order placed successfully!')
    } else {
      alert(`Error: ${response.message}`)
    }
  }

  return (
    <div className="flex p-10">
      <CartForm ref={formRef} />

      <div>
        <div className="bg-black text-center text-white">
          Перегляд замовлення
        </div>

        <CartList />

        <div
          className="mx-auto mt-3 cursor-pointer bg-black p-2 text-center text-white"
          onClick={handleSubmit}
        >
          Оформити замовлення
        </div>
      </div>
    </div>
  )
}
