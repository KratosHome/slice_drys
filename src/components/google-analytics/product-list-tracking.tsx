'use client'

import { useEffect, useRef } from 'react'
import { type AnalyticsItem, trackEcommerceEvent } from '@/utils/analytics'

export default function ProductListTracking({
  items,
  listId,
  listName,
}: {
  items: AnalyticsItem[]
  listId: string
  listName: string
}) {
  const previousList = useRef<string | undefined>(undefined)

  useEffect(() => {
    const signature = JSON.stringify([listId, listName, items])
    if (signature === previousList.current) return

    if (
      trackEcommerceEvent(
        'view_item_list',
        items.map((item, index) => ({ ...item, index })),
        { item_list_id: listId, item_list_name: listName },
      )
    ) {
      previousList.current = signature
    }
  }, [items, listId, listName])

  return null
}
