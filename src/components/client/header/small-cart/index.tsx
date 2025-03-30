'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/client/ui/popover'

import { useCartStore } from '@/store/cartStore'
import Button from '@/components/client/ui/button'
import CartProductCard from './cart-product-card'
import { ResponsiveMotion } from '@/components/client/responsiv-motion/responsive-motion'

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
            className="cursor-pointer"
          >
            <Image src="/icons/bin.svg" width={32} height={32} alt="cart" />

            {isClient && cart.itemList?.length ? (
              <span className="-rig ht-1 absolute top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {cart.itemList.length}
              </span>
            ) : null}
          </ResponsiveMotion>
        </PopoverTrigger>

        <PopoverContent className="mr-0 max-h-[80vh] w-screen overflow-hidden overflow-y-auto rounded-lg bg-white p-4 sm:w-[600px]">
          <div className="absolute right-0 top-0 z-20 w-full bg-white px-5 pt-5">
            <div className="flex w-full items-center justify-between border-b bg-black p-[12px] text-white md:px-[48px] md:py-[32px]">
              <div className="p-0 font-rubik text-[32px] uppercase leading-[0.9] md:text-[64px]">
                {t('basket')}
              </div>

              <ResponsiveMotion
                initial={{ rotate: 0, scale: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ rotate: 90, scale: 0.9, opacity: 0.8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => setOpenCart(false)}
                className="cursor-pointer"
              >
                <Image
                  src="/icons/close.svg"
                  width={48}
                  height={48}
                  alt={`${t('close')}`}
                  className="h-8 w-8 md:h-12 md:w-12"
                />
              </ResponsiveMotion>
            </div>
          </div>

          {cart.itemList?.length === 0 ? (
            <div className="mt-4 h-[300px] pt-[150px] text-center text-[20px] md:pt-[190px]">
              {t('cart-empty')}
            </div>
          ) : (
            <>
              <div className="absolute left-0 top-[75px] w-full bg-white px-6 text-right text-[16px] md:top-[140px]">
                <span className="mr-[24px] font-semibold text-[#7D7D7D]">
                  {t('added')}
                </span>

                <span>
                  {t('itemCount', {
                    count: totalProducts,
                  })}
                </span>
              </div>

              <div className="space-y-4 overflow-y-auto overflow-x-hidden pb-[150px] pt-[70px] md:pt-[150px]">
                {cart.itemList?.map((item) => (
                  <CartProductCard
                    itemData={item}
                    key={item.id + item.weight}
                  />
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-white px-5 pb-4">
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

                <div className="mt-[32px] flex h-[60px] gap-[16px]">
                  <ResponsiveMotion
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex w-full cursor-pointer items-center justify-center border-[1px] border-black text-center"
                    onClick={() => setOpenCart(false)}
                  >
                    {t('continue-shopping')}
                  </ResponsiveMotion>
                  <Button
                    variant={'outline'}
                    className="w-full"
                    disabled={totalPrice < minOrderAmount}
                    onClick={openCat}
                  >
                    <ResponsiveMotion
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-[60px] cursor-pointer items-center justify-center bg-black text-center text-white"
                    >
                      {t('order')}
                    </ResponsiveMotion>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
