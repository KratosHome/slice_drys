'use client'

import { useEffect } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import { finishPageTransition } from '@/components/client/transition-link/transition-state'

interface IPageTransitionProps {
  locale: string
}

export default function PageTransition({ locale }: IPageTransitionProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`
  const loadingText = locale === 'uk' ? 'Завантаження сторінки' : 'Loading page'

  useEffect(() => {
    finishPageTransition()
  }, [routeKey])

  useEffect(() => {
    window.addEventListener('pageshow', finishPageTransition)

    return () => {
      window.removeEventListener('pageshow', finishPageTransition)
      finishPageTransition()
    }
  }, [])

  return (
    <>
      <span
        className="page-transition-status sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {loadingText}
      </span>
      <div className="page-transition-brand" aria-hidden="true">
        <div className="page-transition-logo">
          <svg viewBox="0 0 119 138" focusable="false">
            <use href="/icons/sprite.svg#logo" />
          </svg>
        </div>
      </div>
    </>
  )
}
