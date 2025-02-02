'use client'
import Image from 'next/image'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/client/ui/popover'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Cart() {
  const t = useTranslations('cart')
  const local = useLocale()
  const {
    openCart,
    setOpenCart,
    cart,
    removeItemFromCart,
    updateItemQuantity,
    minOrderAmount,
  } = useCartStore((state) => state)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalPrice =
    cart.itemList?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ) || 0

  return (
    <div className="relative inline-block">
      <Popover open={openCart} onOpenChange={setOpenCart}>
        <PopoverTrigger>
          <div>
            <Image src={'/icons/bin.svg'} width={32} height={32} alt="cart" />
            {isClient && cart.itemList?.length ? (
              <span className="-rig ht-1 absolute top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {cart.itemList.length}
              </span>
            ) : null}
          </div>
        </PopoverTrigger>

        <PopoverContent className="mr-0 rounded-lg bg-white p-4 md:!mr-2 md:w-[600px]">
          <div className="flex items-center justify-between border-b bg-black p-[12px] text-white md:px-[48px] md:py-[32px]">
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
                src={'/icons/close.svg'}
                width={48}
                height={48}
                alt="close"
                className="h-8 w-8 md:h-12 md:w-12"
              />
            </motion.div>
          </div>
          {cart.itemList?.length === 0 ? (
            <div className="mt-4 text-center text-[20px]">Кошик порожній</div>
          ) : (
            <>
              <div className="text-right text-[16px]">
                <span className="mr-[24px] font-semibold text-[#7D7D7D]">
                  Додано
                </span>
                <span className="mr-1">{cart.itemList?.length}</span>
                <span>товарів</span>
              </div>
              <div className="max-h-[400px] space-y-4 overflow-y-auto">
                {cart.itemList?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-2"
                  >
                    <Image
                      src={item.image}
                      width={135}
                      height={135}
                      alt={item.name}
                      className="size-[135px] md:size-[115px]"
                    />
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div className="text-[20px] capitalize">
                          {item.name}
                        </div>
                        <div onClick={() => removeItemFromCart(item.id)}>
                          <Image
                            src={'/icons/delete.svg'}
                            width={24}
                            height={24}
                            alt="delete"
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="font-bold text-[#7D7D7D]">
                        {item.weight} г.
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[20px] text-[#0F0F0F]">
                          {item.price} грн.
                        </div>
                        <div className="flex w-[115px] items-center justify-between bg-black px-[12px] text-white">
                          <div
                            className="font-rubik cursor-pointer text-[40px]"
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
                            className="font-rubik cursor-pointer text-[40px]"
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
              <div className="flex items-center justify-between pt-2">
                <p className="text-lg font-bold">До сплати:</p>
                <div className="flex items-center gap-1">
                  <p>{totalPrice}</p>
                  <p className="text-lg font-bold">грн</p>
                </div>
              </div>
              {totalPrice < minOrderAmount && (
                <div className="mt-2 text-sm text-red-500">
                  Мінімальна сума замовлення {minOrderAmount} грн.
                </div>
              )}
              <div className="mt-[32px] flex h-[60px] gap-[16px]">
                <div
                  className="flex w-full cursor-pointer items-center justify-center border-[1px] border-black text-center"
                  onClick={() => setOpenCart(false)}
                >
                  Продовжити покупки
                </div>
                <Link
                  href={`${local}/cart`}
                  onClick={() => setOpenCart(false)}
                  className="flex w-full cursor-pointer items-center justify-center bg-black text-center text-white"
                >
                  Оформити замовлення
                </Link>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
