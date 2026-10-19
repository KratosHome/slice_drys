'use client'

import Image from 'next/image'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import ChangeQuantityIcon from '@/components/icons/change-quantity-icon'

import { useLocale, useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'
import { useCartStore } from '@/store/cart-store'
import { cn } from '@/utils/cn'

interface ICartProductCardProps {
  itemData: ICartItem
  className?: string
}

export default function CartProductCard({
  itemData: item,
  className,
}: ICartProductCardProps) {
  const t = useTranslations('cart')
  const locale = useLocale() as ILocale
  const name = item.names?.[locale] || item.name

  const { removeItemFromCart, updateItemQuantity } = useCartStore(
    (state) => state,
  )

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const container = button.closest<HTMLElement>('[data-cart-container]')
    const buttons = Array.from(
      container?.querySelectorAll<HTMLButtonElement>('[data-cart-remove]') ??
        [],
    )
    const index = buttons.indexOf(button)
    const focusTarget =
      buttons[index + 1] ??
      buttons[index - 1] ??
      container?.querySelector<HTMLElement>('[data-cart-fallback]') ??
      container
    focusTarget?.focus()
    removeItemFromCart(item.id, item.weight)
  }

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
        alt={name}
        className="size-[85px] md:size-[135px]"
      />
      <div className="flex w-full min-w-0 flex-col gap-2 md:ml-[55px]">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 text-[20px] wrap-anywhere capitalize">
            {name}
          </div>
          <button
            type="button"
            data-cart-remove
            aria-label={`${t('delete')}: ${name}, ${item.weight} ${t('g')}`}
            onClick={handleRemove}
            className="shrink-0 cursor-pointer rounded-sm p-1 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:scale-90"
          >
            <svg
              width="24"
              height="24"
              aria-hidden="true"
              focusable="false"
              className="text-foreground"
            >
              <use href="/icons/sprite.svg#delete" />
            </svg>
          </button>
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
