'use client'

import type { ComponentProps, ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  isPageTransitionInProgress,
  setPageTransitionFallback,
  startPageTransition,
} from './transition-state'

type LinkProps = ComponentProps<typeof Link>

interface ITransitionLinkProps
  extends Omit<LinkProps, 'as' | 'children' | 'href'> {
  children: ReactNode
  href: string
}

function normalizePathname(pathname: string): string {
  return pathname === '/' ? pathname : pathname.replace(/\/+$/, '')
}

function normalizeSearch(search: string): string {
  return new URLSearchParams(search).toString()
}

function isCurrentPage(href: string): boolean {
  const currentUrl = new URL(window.location.href)
  const destinationUrl = new URL(href, currentUrl)

  return (
    destinationUrl.origin === currentUrl.origin &&
    normalizePathname(destinationUrl.pathname) ===
      normalizePathname(currentUrl.pathname) &&
    normalizeSearch(destinationUrl.search) === normalizeSearch(currentUrl.search)
  )
}

export const TransitionLink = ({
  children,
  href,
  onClick,
  onNavigate,
  replace = false,
  scroll,
  ...props
}: ITransitionLinkProps) => {
  const router = useRouter()

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

    if (navigationPrevented || isCurrentPage(href)) return

    event.preventDefault()

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
      replace={replace}
      scroll={scroll}
      onClick={handleClick}
      onNavigate={handleNavigate}
    >
      {children}
    </Link>
  )
}
