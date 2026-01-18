'use client'

import dynamic from 'next/dynamic'

const SubImages = dynamic(
  () => import('@/components/client/main/hero/sub-images/sub-images'),
  {
    ssr: false,
  },
)

export default SubImages
