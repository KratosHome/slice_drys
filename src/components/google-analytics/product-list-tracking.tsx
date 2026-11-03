'use client'

import { useEffect, useRef } from 'react'
import {
  type AnalyticsItem,
  type AnalyticsList,
  getProductAnalyticsItem,
  trackEcommerceEvent,
} from '@/utils/analytics'

const VISIBLE_CARD_FRACTION = 0.5

export function observeProductListItem(
  card: Element,
  item: AnalyticsItem,
  list: AnalyticsList,
  impressions: Set<string>,
) {
  const signature = JSON.stringify([
    list.id,
    list.name,
    list.index,
    item.item_id,
    item.item_variant,
  ])
  if (impressions.has(signature) || typeof IntersectionObserver === 'undefined')
    return

  let observer: IntersectionObserver | undefined
  const observe = () => {
    observer?.disconnect()
    observer = undefined
    if (document.hidden) return

    // The viewport root also clips against the carousel's scrolling/overflow track.
    observer = new IntersectionObserver(
      (entries, source) => {
        if (
          source !== observer ||
          document.hidden ||
          !entries.some(
            (entry) =>
              entry.isIntersecting &&
              entry.intersectionRatio >= VISIBLE_CARD_FRACTION,
          )
        )
          return
        const result = trackEcommerceEvent(
          'view_item_list',
          [{ ...item, index: list.index }],
          { item_list_id: list.id, item_list_name: list.name },
        )
        if (result === 'queued') {
          impressions.add(signature)
          stop()
        }
      },
      { threshold: VISIBLE_CARD_FRACTION },
    )
    observer.observe(card)
  }
  const stop = () => {
    observer?.disconnect()
    observer = undefined
    document.removeEventListener('visibilitychange', observe)
  }
  document.addEventListener('visibilitychange', observe)
  observe()
  return stop
}

export function useProductListTracking(
  product: IProductCard,
  variant: IVariableProduct,
  list?: AnalyticsList,
) {
  const card = useRef<HTMLDivElement>(null)
  const impressions = useRef(new Set<string>())
  const listId = list?.id
  const listName = list?.name
  const index = list?.index
  useEffect(() => {
    if (!card.current || listId === undefined || listName === undefined) return
    const item = getProductAnalyticsItem(product, variant)
    if (item)
      return observeProductListItem(
        card.current,
        item,
        { id: listId, name: listName, index },
        impressions.current,
      )
  }, [product, variant, listId, listName, index])
  return card
}
