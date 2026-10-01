'use client'

import { useEffect, useRef } from 'react'
import { getProductAnalyticsItem, trackEcommerceEvent } from '@/utils/analytics'

export function useProductView(product: IProduct, variant: IVariableProduct) {
  const previousView = useRef<string | undefined>(undefined)

  useEffect(() => {
    const item = getProductAnalyticsItem(product, variant)
    if (!item) return
    const signature = JSON.stringify(item)
    if (signature === previousView.current) return

    if (trackEcommerceEvent('view_item', [item])) {
      previousView.current = signature
    }
  }, [product, variant])
}
