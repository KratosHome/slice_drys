import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useCartStore } from '@/store/cartStore'
import { cn } from '@/utils/cn'

type Props = { itemData: ICartItem; className?: string }

function CartProductCard({ itemData: item, className }: Props) {
  const t = useTranslations('cart')
  const { removeItemFromCart, updateItemQuantity } = useCartStore(
    (state) => state,
  )
  return (
    <div
      key={item.id + item.weight}
      className={cn(
        'flex select-none items-center justify-between gap-4 p-2 transition-transform duration-200 will-change-transform hover:scale-[1.02] hover:shadow-md',
        className,
      )}
    >
      <Image
        src={item.image}
        width={335}
        height={335}
        alt={item.name}
        className="size-[85px] md:size-[135px]"
      />

      <div className="flex w-full flex-col gap-2 md:ml-[55px]">
        <div className="flex items-center justify-between">
          <div className="text-[20px] capitalize">{item.name}</div>

          <div
            onClick={() => removeItemFromCart(item.id, item.weight)}
            className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
          >
            <Image
              src="/icons/delete.svg"
              width={24}
              height={24}
              alt={t('delete')}
            />
          </div>
        </div>

        <div className="font-bold text-[#7D7D7D]">
          {item.weight} {t('g')}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[20px] text-[#0F0F0F]">
            {item.price} {t('uah')}.
          </div>

          <div className="flex w-[115px] items-center justify-between bg-black px-[12px] text-white">
            <div
              className="cursor-pointer font-rubik text-[40px] transition-transform duration-200 hover:scale-110 active:scale-90"
              onClick={() =>
                updateItemQuantity(
                  item.id,
                  item.quantity - 1,
                  item.maxQuantity,
                  item.weight,
                )
              }
            >
              -
            </div>

            <span className="text-[24px]">{item.quantity}</span>

            <div
              className="cursor-pointer font-rubik text-[40px] transition-transform duration-200 hover:scale-110 active:scale-90"
              onClick={() =>
                updateItemQuantity(
                  item.id,
                  item.quantity + 1,
                  item.maxQuantity,
                  item.weight,
                )
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

export default CartProductCard
