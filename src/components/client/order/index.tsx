'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

import { sendOrderNotification } from '@/server/info/order notification.server'
import OrderForm from '@/components/client/order/order-form'
import OrderList from '@/components/client/order/order-list'
import Button from '@/components/client/ui/button'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/hooks/use-toast'

type Props = {
  defaultCities: {
    novaPoshta: IDirectoryCity[]
  }
}

export default function Order({ defaultCities }: Props) {
  const t = useTranslations('cart')
  const tToast = useTranslations('toast')
  const tOrder = useTranslations('order')
  const locale = useLocale() as ILocale
  const { toast } = useToast()

  const { replace } = useRouter()

  const formRef = useRef<{
    reset: () => void
  }>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const submitOrder = useCartStore((state) => state.submitOrder)
  const {
    totalPrice,
    minOrderAmount,
    cart: { userData, itemList },
  } = useCartStore((state) => state)

  useEffect(() => {
    if (userData?.formStep === 4) {
      const btn = submitBtnRef.current
      if (!btn) return

      if (totalPrice < minOrderAmount) {
        setTimeout(() => {
          btn.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }, 300)
      } else {
        btn.focus()
      }
    }
  }, [minOrderAmount, totalPrice, userData?.formStep])

  const handleSubmit = async () => {
    if (!formRef.current) return
    const messageData = {
      totalPrice: totalPrice.toString() + ' ₴',
      paymentMethod:
        userData?.paymentInfo === 'cash' ? 'післяоплата' : 'на картку',
      name: userData?.name + ' ' + userData?.surname,
      phone: userData?.phoneNumber ?? '',
      delivery: userData?.deliveryInfo?.courierInfo
        ? `Кур'єром: ${userData?.deliveryInfo?.courierInfo}`
        : `Новою поштою: ${userData?.deliveryInfo?.city?.label}, ${userData?.deliveryInfo?.branch?.label}`,
      comment: userData?.comment ?? 'Немає коментарів',
      products: (itemList || [])
        ?.map(
          (item, i) =>
            `${i + 1}. ${item.name} (вага ${item.weight}) x ${item.quantity} од`,
        )
        .join('\n'),
      callback: userData?.noCall ? '---------' : 'ПОТРІБЕН',
    }

    const cb = async (resp: IOrderResponse) => {
      if (resp.success) {
        formRef.current?.reset()
        toast({
          duration: 5000,
          title: tToast('success'),
          description: resp.message[locale],
        })
        replace(`/${locale}/`)
        await sendOrderNotification(messageData)
      } else {
        toast({
          variant: 'destructive',
          title: tToast('error'),
          description: resp.message[locale],
        })
      }
    }
    submitOrder(cb)
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-[70px] font-poppins lg:mt-[70px] lg:flex-row lg:items-start lg:gap-[clamp(30px,calc(30px+40*(100vw-1024px)/416),70px)]">
      <OrderForm ref={formRef} defaultCities={defaultCities} />

      <div
        className="all; flex w-full flex-col border-[0.5px] border-transparent lg:px-6 lg:py-8"
        style={{
          borderImageSource:
            'linear-gradient(0deg, #0F0F0F, #0F0F0F), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
          borderImageSlice: '1',
        }}
      >
        <div className="bg-black py-3 text-center font-rubik text-[30px] text-white lg:text-[32px]">
          {tOrder('view_order')}
        </div>
        <OrderList />
        <Button
          ref={submitBtnRef}
          type="submit"
          variant={'outline'}
          className="mx-auto w-full text-nowrap text-base lg:w-min lg:text-xl"
          disabled={totalPrice < minOrderAmount || userData?.formStep !== 4}
          onClick={handleSubmit}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-[60px] min-w-[250px] cursor-pointer items-center justify-center bg-black px-[10px] text-center text-white"
          >
            {t('order')}
          </motion.div>
        </Button>
      </div>
    </div>
  )
}
