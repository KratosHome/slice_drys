'use client'

import React, { useRef } from 'react'
import CartForm from '@/components/client/cart/cart-form'
import CartList from '@/components/client/cart/cart-list'

export default function Cart() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit()
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
