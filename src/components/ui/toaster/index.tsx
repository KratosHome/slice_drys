'use client'

import dynamic from 'next/dynamic'

const Toaster = dynamic(() => import('@/components/ui/toaster/toaster'), {
  ssr: false,
})

export default Toaster
