'use client'

import OrderForm from '@/components/client/order/order-form'
import OrderList from '@/components/client/order/order-list'

import { useRef } from 'react'
import { useCartStore } from '@/store/cartStore'

type Props = {
  defaultCities: {
    novaPoshta: IDirectoryCity[]
  }
}

export default function Order({ defaultCities }: Props) {
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
    <div className="alls mt-10 flex flex-col items-center gap-[70px] lg:mt-[70px] lg:flex-row">
      <OrderForm ref={formRef} defaultCities={defaultCities} />

      <div className="w-full">
        <div className="bg-black text-center text-white">
          Перегляд замовлення
        </div>

        <OrderList />

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
