'use client'

import Image from 'next/image'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/client/ui/popover'
import Link from 'next/link'

import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function SmallCart() {
  const t = useTranslations('cart')
  const local = useLocale()
  const {
    openCart,
    setOpenCart,
    cart,
    totalPrice,
    totalProducts,
    removeItemFromCart,
    updateItemQuantity,
    minOrderAmount,
  } = useCartStore((state) => state)

  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="relative inline-block">
      <Popover open={openCart} onOpenChange={setOpenCart}>
        <PopoverTrigger>
          <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
            <Image src="/icons/bin.svg" width={32} height={32} alt="cart" />

            {isClient && cart.itemList?.length ? (
              <span className="-rig ht-1 absolute top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {cart.itemList.length}
              </span>
            ) : null}
          </motion.div>
        </PopoverTrigger>

        <PopoverContent className="mr-0 max-h-[80vh] w-screen overflow-hidden overflow-y-auto rounded-lg bg-white p-4 sm:w-[600px]">
          <div className="absolute right-0 top-0 z-20 w-full bg-white px-5 pt-5">
            <div className="flex w-full items-center justify-between border-b bg-black p-[12px] text-white md:px-[48px] md:py-[32px]">
              <div className="font-rubik p-0 text-[32px] uppercase leading-[0.9] md:text-[64px]">
                {t('basket')}
              </div>

              <motion.div
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
              </motion.div>
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
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-2 transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
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
                        <div className="text-[20px] capitalize">
                          {item.name}
                        </div>

                        <div
                          onClick={() => removeItemFromCart(item.id)}
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
                            className="font-rubik cursor-pointer text-[40px] transition-transform duration-200 hover:scale-110 active:scale-90"
                            onClick={() =>
                              updateItemQuantity(
                                item.id,
                                item.quantity - 1,
                                item.maxQuantity,
                              )
                            }
                          >
                            -
                          </div>

                          <span className="text-[24px]">{item.quantity}</span>

                          <div
                            className="font-rubik cursor-pointer text-[40px] transition-transform duration-200 hover:scale-110 active:scale-90"
                            onClick={() =>
                              updateItemQuantity(
                                item.id,
                                item.quantity + 1,
                                item.maxQuantity,
                              )
                            }
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex w-full cursor-pointer items-center justify-center border-[1px] border-black text-center"
                    onClick={() => setOpenCart(false)}
                  >
                    {t('continue-shopping')}
                  </motion.div>

                  <Link
                    href={`/${local}/cart`}
                    onClick={() => setOpenCart(false)}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-[60px] cursor-pointer items-center justify-center bg-black text-center text-white"
                    >
                      {t('order')}
                    </motion.div>
                  </Link>
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
