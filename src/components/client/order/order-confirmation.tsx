'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useLayoutEffect, useRef } from 'react'

import GoogleCustomerReviews from '@/components/google-customer-reviews'
import { buttonVariants } from '@/components/ui/button-variants'

export default function OrderConfirmation({
  response,
}: {
  response: IOrderResponse
}) {
  const locale = useLocale() as ILocale
  const t = useTranslations('order')
  const tCart = useTranslations('cart')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const orderId =
    response.receipt?.transactionId ?? response.customerReview?.orderId

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
      {orderId ? (
        <p className="mt-4 text-sm break-all md:text-base">
          {t('confirmation-order-number', { orderId })}
        </p>
      ) : null}
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
