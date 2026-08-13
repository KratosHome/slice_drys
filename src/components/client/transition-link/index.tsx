'use client'

import { useRef, type ComponentProps, type ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  isPageTransitionInProgress,
  setPageTransitionFallback,
  startPageTransition,
} from './transition-state'

type LinkProps = ComponentProps<typeof Link>

interface ITransitionLinkProps extends Omit<
  LinkProps,
  'as' | 'children' | 'href'
> {
  children: ReactNode
  href: string
}

function normalizePathname(pathname: string): string {
  return pathname === '/' ? pathname : pathname.replace(/\/+$/, '')
}

function normalizeSearch(search: string): string {
  return new URLSearchParams(search).toString()
}

function getInternalDestination(href: string): URL | null {
  const currentUrl = new URL(window.location.href)
  const destinationUrl = new URL(href, currentUrl)

  if (
    destinationUrl.origin !== currentUrl.origin ||
    !['http:', 'https:'].includes(destinationUrl.protocol)
  ) {
    return null
  }

  return destinationUrl
}

function isCurrentPage(href: string): boolean {
  const currentUrl = new URL(window.location.href)
  const destinationUrl = getInternalDestination(href)

  if (!destinationUrl) return false

  return (
    normalizePathname(destinationUrl.pathname) ===
      normalizePathname(currentUrl.pathname) &&
    normalizeSearch(destinationUrl.search) ===
      normalizeSearch(currentUrl.search)
  )
}

export const TransitionLink = ({
  children,
  href,
  onClick,
  onFocus,
  onMouseEnter,
  onNavigate,
  onPointerDown,
  prefetch,
  replace = false,
  scroll,
  ...props
}: ITransitionLinkProps) => {
  const router = useRouter()
  const prefetchedHrefRef = useRef<string | null>(null)

  const prefetchDestination = (): void => {
    if (prefetch === false || prefetchedHrefRef.current === href) return

    const destination = getInternalDestination(href)

    if (!destination) return

    prefetchedHrefRef.current = href
    router.prefetch(`${destination.pathname}${destination.search}`)
  }

  const handleClick: NonNullable<LinkProps['onClick']> = (event) => {
    if (isPageTransitionInProgress()) {
      event.preventDefault()
      return
    }

    onClick?.(event)
  }

  const handleNavigate: NonNullable<LinkProps['onNavigate']> = (event) => {
    if (isPageTransitionInProgress()) {
      event.preventDefault()
      return
    }

    let navigationPrevented = false

    onNavigate?.({
      preventDefault: () => {
        navigationPrevented = true
        event.preventDefault()
      },
    })

    if (
      navigationPrevented ||
      !getInternalDestination(href) ||
      isCurrentPage(href)
    ) {
      return
    }

    event.preventDefault()
    prefetchDestination()

    void startPageTransition().then((transitionStarted) => {
      if (!transitionStarted) {
        if (replace) {
          window.location.replace(href)
        } else {
          window.location.assign(href)
        }
        return
      }

      setPageTransitionFallback(href, replace)

      if (replace) {
        router.replace(href, { scroll })
      } else {
        router.push(href, { scroll })
      }
    })
  }

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      onClick={handleClick}
      onFocus={(event) => {
        onFocus?.(event)
        prefetchDestination()
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        prefetchDestination()
      }}
      onNavigate={handleNavigate}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        prefetchDestination()
      }}
    >
      {children}
    </Link>
  )
}
