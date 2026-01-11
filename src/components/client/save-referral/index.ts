'use client'

import dynamic from 'next/dynamic'

const SaveReferral = dynamic(
  () => import('@/components/client/save-referral/save-referral'),
  {
    ssr: false,
  },
)

export default SaveReferral
