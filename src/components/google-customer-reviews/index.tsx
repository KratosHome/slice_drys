'use client'

import Script from 'next/script'
import { useLayoutEffect } from 'react'

import type { CustomerReviewOrder } from '@/types/google-customer-reviews'
import { renderCustomerReviewOptIn } from '@/utils/google-customer-reviews'

type CustomerReviewsCallbackWindow = Window & {
  sliceDrysRenderCustomerReviewOptIn?: () => void
}

/** Mount only after the server has successfully saved the order. */
export default function GoogleCustomerReviews({
  order,
}: {
  order: CustomerReviewOrder
}) {
  // Install Google's callback before next/script starts loading in its passive
  // effect. onReady also covers a script cached by a previous confirmation.
  useLayoutEffect(() => {
    let active = true
    const target = window as CustomerReviewsCallbackWindow
    const renderOptIn = () => renderCustomerReviewOptIn(order, () => active)
    target.sliceDrysRenderCustomerReviewOptIn = renderOptIn
    return () => {
      active = false
      if (target.sliceDrysRenderCustomerReviewOptIn === renderOptIn) {
        delete target.sliceDrysRenderCustomerReviewOptIn
      }
    }
  }, [order])

  return (
    <Script
      id="google-customer-reviews"
      src="https://apis.google.com/js/platform.js?onload=sliceDrysRenderCustomerReviewOptIn"
      strategy="afterInteractive"
      onReady={() => {
        const target = window as CustomerReviewsCallbackWindow
        target.sliceDrysRenderCustomerReviewOptIn?.()
      }}
    />
  )
}
