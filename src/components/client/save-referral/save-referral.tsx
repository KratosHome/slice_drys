'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const TTL_30_DAYS = 1000 * 60 * 60 * 24 * 30

const SaveReferral = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return

    localStorage.setItem(
      'ref',
      JSON.stringify({
        code: ref,
        expiresAt: Date.now() + TTL_30_DAYS,
      }),
    )
  }, [searchParams])

  useEffect(() => {
    const raw = localStorage.getItem('ref')
    if (!raw) return

    const { expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      localStorage.removeItem('ref')
    }
  }, [])

  return null
}

export default SaveReferral
