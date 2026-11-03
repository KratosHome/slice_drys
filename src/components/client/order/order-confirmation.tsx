'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useLayoutEffect, useRef } from 'react'

import GoogleCustomerReviews from '@/components/google-customer-reviews'
import { buttonVariants } from '@/components/ui/button-variants'

export default function OrderConfirmation({
  response,
  showOriginalNotice,
  onReturnToDraft,
}: {
  response: Extract<IOrderResponse, { success: true }>
  showOriginalNotice?: boolean
  onReturnToDraft?: () => void
}) {
  const locale = useLocale() as ILocale
  const t = useTranslations('order')
  const tCart = useTranslations('cart')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const orderId = response.receipt.transactionId
  const currency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: response.receipt.currency,
  })

  useLayoutEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section
      aria-labelledby="order-confirmation-title"
      className="border-foreground/20 mx-auto my-10 max-w-[760px] border px-5 py-10 text-center md:my-[70px] md:px-10"
    >
      <h2
        ref={headingRef}
        id="order-confirmation-title"
        tabIndex={-1}
        className="font-rubik text-[28px] leading-tight focus:outline-none md:text-[36px]"
      >
        {t('confirmation-title')}
      </h2>
      <p className="mt-5 text-lg" role="status">
        {response.message[locale] || t('success')}
      </p>
      <p className="mt-4 text-sm break-all md:text-base">
        {t('confirmation-order-number', { orderId })}
      </p>
      <ul className="mt-6 space-y-2 text-start">
        {response.receipt.items.map((item) => (
          <li
            key={`${item.id}:${item.weight}`}
            className="flex justify-between gap-4"
          >
            <span>
              {t('receipt-item', {
                name: item.name,
                weight: item.weight,
                quantity: item.quantity,
              })}
            </span>
            <span className="whitespace-nowrap">
              {currency.format(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between gap-4 font-bold">
        {t('receipt-total')}{' '}
        <span>{currency.format(response.receipt.value)}</span>
      </p>
      {showOriginalNotice && <p className="mt-5">{t('original-confirmed')}</p>}
      {onReturnToDraft && (
        <button
          type="button"
          className="mx-auto mt-4 block cursor-pointer underline underline-offset-4"
          onClick={onReturnToDraft}
        >
          {t('return-to-draft')}
        </button>
      )}
      <Link
        href={`/${locale}/products`}
        className={buttonVariants({
          variant: 'button',
          className: 'mt-8 h-auto! min-h-[50px] px-6 py-3 whitespace-normal',
        })}
      >
        {tCart('continue-shopping')}
      </Link>
      {response.customerReview ? (
        <GoogleCustomerReviews order={response.customerReview} />
      ) : null}
    </section>
  )
}
