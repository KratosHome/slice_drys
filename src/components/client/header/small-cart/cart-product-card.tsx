import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useCartStore } from '@/store/cart-store'
import { cn } from '@/utils/cn'
import { ResponsiveMotion } from '../../responsive-motion'
import { ChangeQuantityIcon } from '../../product-page/icons'

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
        'hover:bg-foreground/5 flex items-center justify-between gap-4 p-2 transition-transform duration-200 will-change-transform select-none hover:scale-[1.02]',
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
            <svg
              width="24"
              height="24"
              role="img"
              aria-label={t('delete')}
              className="text-foreground"
            >
              <use href="/icons/sprite.svg#delete" />
            </svg>
          </div>
        </div>

        <div className="font-bold text-[#7D7D7D]">
          {item.weight} {t('g')}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-foreground text-[20px]">
            {item.price} {t('uah')}.
          </div>

          <div className="bg-foreground text-background flex h-[50px] min-w-[115px] items-center justify-between px-2.5 font-bold">
            <ResponsiveMotion
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() =>
                updateItemQuantity(
                  item.id,
                  item.quantity - 1,
                  item.maxQuantity,
                  item.weight,
                )
              }
            >
              <ChangeQuantityIcon
                content="-"
                aria-label={t('remove')}
                disabled={item.quantity === 1}
                aria-disabled={item.quantity === 1}
              />
            </ResponsiveMotion>
            <div className="min-w-4 text-center text-2xl">{item.quantity}</div>
            <ResponsiveMotion
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() =>
                updateItemQuantity(
                  item.id,
                  item.quantity + 1,
                  item.maxQuantity,
                  item.weight,
                )
              }
            >
              <ChangeQuantityIcon content="+" aria-label={t('add')} />
            </ResponsiveMotion>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProductCard
