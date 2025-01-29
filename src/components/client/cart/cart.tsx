'use client'

import React, { useRef } from 'react'
import CartForm from '@/components/client/cart/cart-form'
import CartList from '@/components/client/cart/cart-list'
import { createOrUpdateOrder } from '@/server/orders/create-order'
import { useCartStore, clearCart } from '@/store/cartStore'

export default function Cart() {
  const formRef = useRef<HTMLFormElement>(null)
  const cart = useCartStore((state) => state.cart)

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit()
    }
    const productsToSubmit = (cart?.itemList || []).map((item) => ({
      id: item.id,
      name: item.name,
      count: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }))
    const userToSubmit = {
      name: cart?.formData?.name || '',
      surname: cart?.formData?.surname || '',
      id: 'mock',
      phone: cart?.formData?.phoneNumber || '',
      email: cart?.formData?.email || '',
    }
    const deliveryToSubmit = {
      city: cart?.formData?.deliveryInfo?.city || '',
      department: cart.formData?.deliveryInfo?.brunch || '',
      phone: cart.formData?.phoneNumber || '',
    }

    const OrderDataToSubmit = {
      id: '',
      status: 'new' as const,
      products: productsToSubmit,
      total: productsToSubmit?.reduce((acc, product) => acc + product.total, 0),
      delivery: deliveryToSubmit,
      user: userToSubmit,
      payment: {
        method: (cart.formData?.paymentInfo as 'cash' | 'card') || 'cash',
      },
      comment: cart.formData?.comment || '',
    }
    createOrUpdateOrder(OrderDataToSubmit)
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
