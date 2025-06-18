'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useCartStore } from '@/store/cart-store'
import CartProductCard from './cart-product-card'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import { Button } from '@/components/ui/button'

export default function SmallCart() {
  const t = useTranslations('cart')
  const local = useLocale()

  const router = useRouter()

  const {
    openCart,
    setOpenCart,
    cart,
    totalPrice,
    totalProducts,
    minOrderAmount,
  } = useCartStore((state) => state)

  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const openCat = () => {
    router.push(`/${local}/order`)
    setOpenCart(false)
  }

  return (
    <div className="relative flex flex-col justify-center">
      <Popover open={openCart} onOpenChange={setOpenCart}>
        <PopoverTrigger>
          <ResponsiveMotion
            whileHover={{ scale: 1.1 }}
            className="text-foreground cursor-pointer"
          >
            <svg width={32} height={32} role="img" aria-label={t('basket')}>
              <use href="/icons/sprite.svg#bin"></use>
            </svg>
            {isClient && cart.itemList?.length ? (
              <span className="-rig ht-1 absolute top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {cart.itemList.length}
              </span>
            ) : null}
          </ResponsiveMotion>
        </PopoverTrigger>

        <PopoverContent className="bg-background outline-foreground mr-0 max-h-[80vh] w-screen overflow-hidden overflow-y-auto rounded-lg p-4 outline-1 sm:w-[600px]">
          <div className="bg-background absolute top-0 right-0 z-20 w-full rounded-t-lg px-5 pt-5">
            <div className="bg-foreground text-background flex w-full items-center justify-between border-b p-[12px] md:px-[48px] md:py-[32px]">
              <div className="font-rubik p-0 text-[32px] leading-[0.9] uppercase md:text-[64px]">
                {t('basket')}
              </div>

              <ResponsiveMotion
                initial={{ rotate: 0, scale: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ rotate: 90, scale: 0.9, opacity: 0.8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => setOpenCart(false)}
                className="cursor-pointer text-red-700"
              >
                <svg
                  className="h-8 w-8 md:h-12 md:w-12"
                  role="img"
                  aria-label={t('close')}
                >
                  <use href="/icons/sprite.svg#close"></use>
                </svg>
              </ResponsiveMotion>
            </div>
          </div>

          {cart.itemList?.length === 0 ? (
            <div className="mt-4 h-[300px] pt-[150px] text-center text-[20px] md:pt-[190px]">
              {t('cart-empty')}
            </div>
          ) : (
            <>
              <div className="bg-background absolute top-[75px] left-0 w-full px-6 text-right text-[16px] md:top-[140px]">
                <span className="mr-[24px] font-semibold text-[#7D7D7D]">
                  {t('added')}
                </span>

                <span>
                  {t('itemCount', {
                    count: totalProducts,
                  })}
                </span>
              </div>

              <div className="space-y-4 overflow-x-hidden overflow-y-auto pt-[70px] pb-[150px] md:pt-[150px]">
                {cart.itemList?.map((item) => (
                  <CartProductCard
                    itemData={item}
                    key={item.id + item.weight}
                  />
                ))}
              </div>

              <div className="bg-background absolute bottom-0 left-0 w-full rounded-b-lg px-5 pb-4">
                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-bold">{t('total')}:</p>

                  <div className="flex items-center gap-1">
                    <p>{totalPrice}</p>

                    <p className="text-lg font-bold">{t('uah')}</p>
                  </div>
                </div>

                {totalPrice < minOrderAmount && (
                  <div className="mt-2 text-sm text-red-500">
                    {t('minimum-order-amount')} {minOrderAmount} {t('uah')}.
                  </div>
                )}

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
                    className="bg-foreground text-background flex w-full items-center justify-center"
                  >
                    <Button
                      variant={'none'}
                      disabled={totalPrice < minOrderAmount}
                      onClick={openCat}
                      className="text-base md:text-xl"
                    >
                      {t('order')}
                    </Button>
                  </ResponsiveMotion>
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
