'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import OrderForm, { ORDER_FORM_ID } from '@/components/client/order/order-form'
import OrderList from '@/components/client/order/order-list'
import OrderConfirmation from '@/components/client/order/order-confirmation'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import Loading from '@/components/ui/loading'
import { getCartAnalyticsItems, trackEcommerceEvent } from '@/utils/analytics'

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
    return undefined
  }
}

export default function Order({ defaultCities }: Props) {
  const t = useTranslations('cart')
  const tToast = useTranslations('toast')
  const tOrder = useTranslations('order')
  const locale = useLocale() as ILocale
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formValid, setFormValid] = useState(false)
  const [confirmation, setConfirmation] = useState<{
    response: Extract<IOrderResponse, { success: true }>
    retried: boolean
  } | null>(null)
  const checkoutQueued = useRef(false)

  const formRef = useRef<{
    reset: () => void
  }>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const submitOrder = useCartStore((state) => state.submitOrder)
  const {
    totalPrice,
    minOrderAmount,
    checkout,
    cart: { userData, itemList },
  } = useCartStore((state) => state)
  const original = checkout?.input

  useEffect(() => {
    if (checkoutQueued.current || confirmation || original || !itemList?.length)
      return
    checkoutQueued.current =
      trackEcommerceEvent('begin_checkout', getCartAnalyticsItems(itemList)) ===
      'queued'
  }, [itemList, original, confirmation])

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

  const submit = (retried: boolean) => {
    if (loading) return
    const pending = useCartStore.getState().checkout?.input
    if (retried) {
      if (!original || pending?.idempotencyKey !== original.idempotencyKey)
        return
    } else if (
      pending ||
      !formRef.current ||
      totalPrice < minOrderAmount ||
      userData?.formStep !== 3
    ) {
      return
    }
    setLoading(true)

    return submitOrder(
      retried ? undefined : getStoredReferralCode(),
      (resp) => {
        setLoading(false)
        if (resp.success) {
          setConfirmation({ response: resp, retried })
        } else {
          toast({
            variant: 'destructive',
            title: tToast('error'),
            description:
              resp.errorCode === 'idempotency_conflict'
                ? tOrder('original-conflict')
                : resp.message[locale],
          })
        }
      },
    )
  }

  if (confirmation) {
    return (
      <OrderConfirmation
        response={confirmation.response}
        showOriginalNotice={confirmation.retried || Boolean(itemList?.length)}
        onReturnToDraft={
          itemList?.length
            ? () => {
                checkoutQueued.current = false
                setConfirmation(null)
              }
            : undefined
        }
      />
    )
  }

  if (original) {
    return (
      <section
        aria-labelledby="original-order-title"
        aria-busy={loading}
        className="border-foreground/20 mx-auto my-10 max-w-[760px] border px-5 py-8 md:px-10"
      >
        {loading ? <Loading /> : null}
        <h2 id="original-order-title" className="font-rubik text-2xl">
          {tOrder('original-title')}
        </h2>
        {!loading && <p className="mt-4">{tOrder('original-explanation')}</p>}
        <ul className="my-4 list-disc space-y-1 ps-6">
          {original.products.map((product, index) => {
            const item = itemList?.find((entry) => entry.id === product.id)
            return (
              <li key={`${product.id}:${product.weight}`}>
                {tOrder('receipt-item', {
                  name:
                    item?.names?.[locale] ||
                    item?.name ||
                    tOrder('original-product', { number: index + 1 }),
                  weight: product.weight,
                  quantity: product.count,
                })}
              </li>
            )
          })}
        </ul>
        {original.comment && (
          <p className="my-4 break-words whitespace-pre-wrap">
            {tOrder('comment-title')}: {original.comment}
          </p>
        )}
        {!loading && (
          <Button
            type="button"
            variant="button"
            onClick={() => submit(true)}
            className="h-auto! min-h-[50px] px-6 py-3 whitespace-normal"
          >
            {tOrder('retry-original')}
          </Button>
        )}
      </section>
    )
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-[70px] lg:mt-[70px] lg:flex-row lg:items-start lg:gap-[clamp(30px,calc(30px+40*(100vw-1024px)/416),70px)]">
      {loading ? <Loading /> : null}
      <OrderForm
        ref={formRef}
        defaultCities={defaultCities}
        onFinalSubmit={() => submit(false)}
        onValidityChange={setFormValid}
        submitting={loading}
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
            form={ORDER_FORM_ID}
            variant={'none'}
            className="mt-5 h-[auto] w-full self-center text-base text-nowrap lg:w-min lg:text-xl"
            disabled={
              loading ||
              !formValid ||
              totalPrice < minOrderAmount ||
              userData?.formStep !== 3
            }
          >
            <ResponsiveMotion
              variant="button"
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
