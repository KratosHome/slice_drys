'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import OrderForm from '@/components/client/order/order-form'
import OrderList from '@/components/client/order/order-list'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import Loading from '@/components/ui/loading'

type Props = {
  defaultCities: {
    novaPoshta: IDirectoryCity[]
  }
}

function getStoredReferralCode(): string | undefined {
  try {
    const raw = window.localStorage.getItem('ref')
    if (!raw) return undefined

    const storedReferral = JSON.parse(raw) as {
      code?: unknown
      expiresAt?: unknown
    }

    if (
      typeof storedReferral.code !== 'string' ||
      !storedReferral.code.trim() ||
      typeof storedReferral.expiresAt !== 'number' ||
      !Number.isFinite(storedReferral.expiresAt) ||
      Date.now() > storedReferral.expiresAt
    ) {
      window.localStorage.removeItem('ref')
      return undefined
    }

    return storedReferral.code.trim()
  } catch {
    window.localStorage.removeItem('ref')
    return undefined
  }
}

export default function Order({ defaultCities }: Props) {
  const t = useTranslations('cart')
  const tToast = useTranslations('toast')
  const tOrder = useTranslations('order')
  const locale = useLocale() as ILocale
  const { toast } = useToast()

  const { replace } = useRouter()

  const [loading, setLoading] = useState(false)

  const formRef = useRef<{
    reset: () => void
  }>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const submitOrder = useCartStore((state) => state.submitOrder)
  const {
    totalPrice,
    minOrderAmount,
    cart: { userData },
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
    setLoading(true)

    const referralCode = getStoredReferralCode()

    const cb = (resp: IOrderResponse) => {
      if (resp.success) {
        toast({
          duration: 5000,
          title: tToast('success'),
          description: resp.message[locale],
        })
        setLoading(false)
        formRef.current?.reset()
        replace(`/${locale}/`)
      } else {
        setLoading(false)
        toast({
          variant: 'destructive',
          title: tToast('error'),
          description: resp.message[locale],
        })
      }
    }
    submitOrder(referralCode, cb)
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-[70px] lg:mt-[70px] lg:flex-row lg:items-start lg:gap-[clamp(30px,calc(30px+40*(100vw-1024px)/416),70px)]">
      {loading ? <Loading /> : null}
      <OrderForm
        ref={formRef}
        defaultCities={defaultCities}
        onFinalSubmit={handleSubmit}
      />

      <div
        className="flex w-full flex-col border-[0.5px] border-transparent lg:px-6 lg:py-8"
        style={{
          borderImageSource:
            'linear-gradient(0deg, #0F0F0F, #0F0F0F), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
          borderImageSlice: '1',
        }}
      >
        <div className="font-rubik bg-foreground text-background py-3 text-center text-[30px] lg:text-[32px]">
          {tOrder('view-order')}
        </div>
        <OrderList />
        {!(totalPrice < minOrderAmount || userData?.formStep !== 3) && (
          <Button
            ref={submitBtnRef}
            type="submit"
            variant={'none'}
            className="mt-5 h-[auto] w-full self-center text-base text-nowrap lg:w-min lg:text-xl"
            disabled={totalPrice < minOrderAmount || userData?.formStep !== 3}
            onClick={handleSubmit}
          >
            <ResponsiveMotion
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-foreground text-background flex h-[60px] w-full min-w-[250px] items-center justify-center px-[10px] text-center"
            >
              {t('order')}
            </ResponsiveMotion>
          </Button>
        )}
      </div>
    </div>
  )
}
