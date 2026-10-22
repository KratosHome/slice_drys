'use client'

import { useEffect, useRef } from 'react'
import { increasePostVisit } from '@/server/posts/increase-post-visit.server'

export default function PostVisitTracker({ slug }: { slug: string }) {
  const trackedSlug = useRef<string | null>(null)

  useEffect(() => {
    // React can replay effects; only a new article opening should count.
    if (trackedSlug.current === slug) return
    trackedSlug.current = slug

    void increasePostVisit(slug).catch(() => undefined)
  }, [slug])

  return null
}
