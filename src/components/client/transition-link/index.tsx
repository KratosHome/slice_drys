'use client'

import type { ComponentProps, ReactNode } from 'react'

import Link from 'next/link'

import { startPageTransition } from './transition-state'

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
  onNavigate,
  ...props
}: ITransitionLinkProps) => {
  const handleNavigate: NonNullable<LinkProps['onNavigate']> = (event) => {
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

    startPageTransition()
  }

  return (
    <Link {...props} href={href} onNavigate={handleNavigate}>
      {children}
    </Link>
  )
}
