'use client'

import { type RefObject, useId } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import { Button } from '@/components/ui/button'
import { TransitionLink } from '@/components/client/transition-link'
import CartProductCard from '@/components/client/cart-product-card'
import { useCartStore } from '@/store/cart-store'
import { cn } from '@/utils/cn'
import styles from './small-cart.module.css'
import { useCartProductNames } from '@/hooks/useCartProductNames'

export default function CartPanel({
  id,
  triggerRef,
}: {
  id: string
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  const t = useTranslations('cart')
  const local = useLocale() as ILocale
  const titleId = useId()
  const openCart = useCartStore((state) => state.openCart)
  useCartProductNames(openCart)
  const setOpenCart = useCartStore((state) => state.setOpenCart)
  const cart = useCartStore((state) => state.cart)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const totalProducts = useCartStore((state) => state.totalProducts)
  const minOrderAmount = useCartStore((state) => state.minOrderAmount)
  const belowMinimum = totalPrice < minOrderAmount
  const missingAmount = Math.max(0, minOrderAmount - totalPrice)

  return (
    <Popover
      open={openCart}
      onOpenChange={(open, details) => {
        // The lightweight trigger lives outside this lazy Popover root.
        // Let its own click toggle the cart instead of dismissing it first.
        if (
          !open &&
          details.reason === 'outside-press' &&
          details.event.target instanceof Node &&
          triggerRef.current?.contains(details.event.target)
        ) {
          details.cancel()
          return
        }
        setOpenCart(open)
      }}
    >
      <PopoverContent
        id={id}
        data-cart-container
        aria-labelledby={titleId}
        anchor={triggerRef}
        finalFocus={triggerRef}
        collisionPadding={8}
        className={cn(
          styles.popover,
          'bg-background outline-foreground mr-0 max-h-[80vh] w-screen max-w-[calc(100vw-16px)] overflow-hidden overflow-y-auto rounded-lg p-4 outline-1 sm:w-[600px]',
        )}
      >
        <div
          className={cn(
            styles.header,
            'bg-background absolute top-0 right-0 z-20 w-full rounded-t-lg px-5 pt-5',
          )}
        >
          <div className="bg-foreground text-background flex w-full items-center justify-between border-b p-[12px] md:px-[48px] md:py-[32px]">
            <h2
              id={titleId}
              className="font-rubik p-0 text-[32px] leading-[0.9] uppercase md:text-[64px]"
            >
              {t('basket')}
            </h2>
            <button
              type="button"
              data-cart-fallback
              aria-label={t('close')}
              onClick={() => setOpenCart(false)}
              className={cn(styles.close, 'cursor-pointer text-red-700')}
            >
              <svg className="h-8 w-8 md:h-12 md:w-12" aria-hidden="true">
                <use href="/icons/sprite.svg#close" />
              </svg>
            </button>
          </div>
        </div>

        {cart.itemList?.length === 0 ? (
          <div
            className={cn(
              styles.body,
              'mt-4 h-[300px] pt-[150px] text-center text-[20px] md:pt-[190px]',
            )}
          >
            {t('cart-empty')}
          </div>
        ) : (
          <>
            <div
              className={cn(
                styles.meta,
                'bg-background absolute top-[75px] left-0 w-full px-6 text-right text-[16px] md:top-[140px]',
              )}
            >
              <span className="mr-[24px] font-semibold text-[#7D7D7D]">
                {t('added')}
              </span>
              <span>
                {t('item-count', {
                  count: totalProducts,
                })}
              </span>
            </div>
            <div
              className={cn(
                styles.body,
                'space-y-4 overflow-x-hidden overflow-y-auto pt-[70px] pb-[150px] md:pt-[150px]',
              )}
            >
              {cart.itemList?.map((item) => (
                <CartProductCard itemData={item} key={item.id + item.weight} />
              ))}
            </div>
            <div
              className={cn(
                styles.footer,
                'bg-background absolute bottom-0 left-0 w-full rounded-b-lg px-5 pb-4',
              )}
            >
              <div className="flex items-center justify-between pt-2">
                <p className="text-lg font-bold">{t('total')}:</p>
                <div className="flex items-center gap-1">
                  <p>{totalPrice}</p>
                  <p className="text-lg font-bold">{t('uah')}</p>
                </div>
              </div>

              {belowMinimum ? (
                <div className="mt-2 text-sm text-red-500" aria-live="polite">
                  {t('minimum-order-amount')} {minOrderAmount} {t('uah')}.{' '}
                  {t('minimum-order-shortfall', { amount: missingAmount })}
                </div>
              ) : null}

              <div className="mt-[32px] flex h-[60px] items-stretch gap-[16px]">
                <ResponsiveMotion
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-foreground bg-background flex w-full items-center justify-center border-[1px]"
                >
                  <Button
                    variant={'none'}
                    onClick={() => setOpenCart(false)}
                    className="text-base md:text-xl"
                  >
                    {t('continue-shopping')}
                  </Button>
                </ResponsiveMotion>
                <ResponsiveMotion
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={belowMinimum}
                  className={cn(
                    'bg-foreground text-background flex w-full items-center justify-center',
                    belowMinimum && 'bg-gray-500',
                  )}
                >
                  {belowMinimum ? (
                    <Button
                      type="button"
                      variant="none"
                      disabled
                      className="h-full w-full text-base md:text-xl"
                    >
                      {t('order')}
                    </Button>
                  ) : (
                    <TransitionLink
                      href={`/${local}/order`}
                      onClick={() => setOpenCart(false)}
                      className="flex h-full w-full items-center justify-center text-base md:text-xl"
                    >
                      {t('order')}
                    </TransitionLink>
                  )}
                </ResponsiveMotion>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
