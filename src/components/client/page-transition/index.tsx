'use client'

import { useEffect, useRef } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import {
  finishPageTransition,
  startPageTransition,
} from '@/components/client/transition-link/transition-state'

interface IPageTransitionProps {
  locale: string
}

export default function PageTransition({ locale }: IPageTransitionProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`
  const routeKeyRef = useRef(routeKey)
  const loadingText = locale === 'uk' ? 'Завантаження сторінки' : 'Loading page'

  useEffect(() => {
    routeKeyRef.current = routeKey
    finishPageTransition()
  }, [routeKey])

  useEffect(() => {
    const handlePopState = (): void => {
      const nextRouteKey = `${window.location.pathname}?${new URLSearchParams(window.location.search).toString()}`

      if (nextRouteKey !== routeKeyRef.current) {
        startPageTransition()
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('pageshow', finishPageTransition)

    return () => {
      window.removeEventListener('popstate', handlePopState)
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
        data-loading-text={loadingText}
      />
      <div className="page-transition-progress" aria-hidden="true">
        <span className="page-transition-progress-bar" />
      </div>
    </>
  )
}
