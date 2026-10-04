'use client'

import dynamic from 'next/dynamic'
import { type RefObject, useSyncExternalStore } from 'react'

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

export default function SubImages(props: {
  subImages: IHeroAnimationSubImage[]
  subImagesRefs: RefObject<HTMLImageElement[]>
}) {
  const desktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getServerSnapshot,
  )
  return desktop ? <DesktopSubImages {...props} /> : null
}
