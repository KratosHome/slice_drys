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
    <div className="allq mt-10 flex flex-col items-center gap-[70px] lg:mt-[70px] lg:flex-row lg:items-start">
      <OrderForm ref={formRef} defaultCities={defaultCities} />

      <div
        className="max-h-[100%] w-full border-[0.5px] border-transparent lg:px-6 lg:py-8"
        style={{
          borderImageSource:
            'linear-gradient(0deg, #0F0F0F, #0F0F0F), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
          borderImageSlice: '1',
        }}
      >
        <div className="bg-black py-3 text-center font-rubik text-[30px] text-white lg:text-[32px]">
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
