'use client'

import Image from 'next/image'

import { useCartStore } from '@/store/cartStore'

export default function CartProductCard({
  id,
  image,
  name,
  price,
  weight,
  quantity,
}: ICartItem) {
  const { removeItemFromCart, addItemToCart } = useCartStore((state) => state)

  return (
    <div className="mx-3 flex h-40 items-center border-b border-gray-200 py-2 hover:bg-gray-100">
      <Image
        src={image}
        width={200}
        height={200}
        alt={name}
        className="max-h-40 w-1/3"
      />

      <div className="ml-3 h-full w-2/3">
        <div className="h-[50%]">
          <div className="flex justify-between">
            <div className="font text">{name}</div>

            <Image
              src="/icons/trash-can.svg"
              alt="facebook icon"
              width={32}
              height={32}
              className="cursor-pointer"
              onClick={() => removeItemFromCart(id, weight)}
            />
          </div>

          <p className="text-sm text-gray-500"> {weight}г</p>
        </div>

        <div className="flex h-[50%] items-end justify-between">
          <div className="text mt-1">{price * quantity} грн</div>

          <div className="flex bg-black text-sm text-white">
            <div
              className="cursor-pointer"
              onClick={() =>
                addItemToCart({
                  id: id,
                  quantity: -1,
                  image: image,
                  name: name,
                  price: price,
                  weight: weight,
                })
              }
            >
              -
            </div>{' '}
            {quantity}{' '}
            <div
              className="cursor-pointer"
              onClick={() =>
                addItemToCart({
                  id: id,
                  quantity: 1,
                  image: image,
                  name: name,
                  price: price,
                  weight: weight,
                })
              }
            >
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
