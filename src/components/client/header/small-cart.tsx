'use client'

import dynamic from 'next/dynamic'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'

const CartPanel = dynamic(() => import('./cart-panel'), { ssr: false })

export default function SmallCart() {
  const t = useTranslations('cart')
  const openCart = useCartStore((state) => state.openCart)
  const setOpenCart = useCartStore((state) => state.setOpenCart)
  const itemCount = useCartStore((state) => state.cart.itemList?.length ?? 0)
  const [hasOpenedCart, setHasOpenedCart] = useState(openCart)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(
    () =>
      useCartStore.subscribe(
        (state) => state.openCart,
        (open) => {
          if (open) setHasOpenedCart(true)
        },
      ),
    [],
  )

  return (
    <div className="relative flex flex-col justify-center">
      <Button
        ref={triggerRef}
        type="button"
        variant="none"
        size="icon"
        className="h-8 w-8 overflow-visible p-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[ease] [@media(hover:hover)_and_(pointer:fine)]:motion-safe:hover:scale-110"
        aria-label={t('basket')}
        aria-haspopup="dialog"
        aria-expanded={openCart}
        aria-controls={openCart ? panelId : undefined}
        onClick={() => {
          setHasOpenedCart(true)
          setOpenCart(!openCart)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpenCart(false)
        }}
      >
        <span className="text-foreground relative block cursor-pointer">
          <svg width={32} height={32} aria-hidden="true">
            <use href="/icons/sprite.svg#bin" />
          </svg>
          {itemCount > 0 ? (
            <span className="absolute top-0 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {itemCount}
            </span>
          ) : null}
        </span>
      </Button>
      {hasOpenedCart || openCart ? (
        <CartPanel id={panelId} triggerRef={triggerRef} />
      ) : null}
    </div>
  )
}
