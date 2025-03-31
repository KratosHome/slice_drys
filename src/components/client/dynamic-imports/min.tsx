'use client'

import dynamic from 'next/dynamic'

const ScrollToTop = dynamic(
  () => import('@/components/client/scroll-to-top/scroll-to-top'),
  {
    ssr: false,
  },
)

const Toaster = dynamic(() => import('@/components/admin/ui/toaster'), {
  ssr: false,
})

export default function ClientDynamicMain() {
  return (
    <>
      <ScrollToTop />
      <Toaster />
    </>
  )
}
