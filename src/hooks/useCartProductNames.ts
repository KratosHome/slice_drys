'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { getCartProductNames } from '@/server/products/get-cart-product-names.server'
import { useCartStore } from '@/store/cart-store'

const pendingRequests = new Map<string, Promise<ICartProductNames[]>>()

export function useCartProductNames(enabled = true) {
  const locale = useLocale()
  const items = useCartStore((state) => state.cart.itemList)
  const setItemNames = useCartStore((state) => state.setItemNames)
  const missingIds = JSON.stringify(
    [
      ...new Set(
        items
          ?.filter((item) => !item.names?.uk || !item.names?.en)
          .map((item) => item.id),
      ),
    ].sort(),
  )

  useEffect(() => {
    const ids: string[] = JSON.parse(missingIds)
    if (!enabled || !ids.length) return

    let request = pendingRequests.get(missingIds)
    if (!request) {
      request = getCartProductNames(ids).finally(() => {
        pendingRequests.delete(missingIds)
      })
      pendingRequests.set(missingIds, request)
    }

    // Merge into the current cart even if this view has closed in the meantime.
    // Removed items stay removed, and a failed lookup keeps their saved names.
    void request.then(setItemNames).catch(() => undefined)
  }, [enabled, locale, missingIds, setItemNames])
}
