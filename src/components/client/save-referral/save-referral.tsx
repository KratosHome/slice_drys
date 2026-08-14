'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const TTL_30_DAYS = 1000 * 60 * 60 * 24 * 30

const SaveReferral = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')?.trim()
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

    try {
      const storedReferral = JSON.parse(raw) as {
        code?: unknown
        expiresAt?: unknown
      }

      if (
        typeof storedReferral.code !== 'string' ||
        !storedReferral.code.trim() ||
        typeof storedReferral.expiresAt !== 'number' ||
        !Number.isFinite(storedReferral.expiresAt) ||
        Date.now() > storedReferral.expiresAt
      ) {
        localStorage.removeItem('ref')
      }
    } catch {
      localStorage.removeItem('ref')
    }
  }, [])

  return null
}

export default SaveReferral
