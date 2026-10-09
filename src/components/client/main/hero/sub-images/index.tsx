'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'
import type { HeroSlideSlug } from '@/data/hero-links'

const DesktopSubImages = dynamic(
  () => import('@/components/client/main/hero/sub-images/sub-images'),
  {
    ssr: false,
  },
)

const desktopQuery = '(min-width: 1024px)'
const subscribeToDesktop = (listener: () => void) => {
  const media = window.matchMedia(desktopQuery)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
const getDesktopSnapshot = () => window.matchMedia(desktopQuery).matches
const getServerSnapshot = () => false

export default function SubImages(props: { slug: HeroSlideSlug }) {
  const desktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getServerSnapshot,
  )
  return desktop ? <DesktopSubImages {...props} /> : null
}
