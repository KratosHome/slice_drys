'use client'

import type { MouseEvent, ReactNode, Ref } from 'react'

import Link, { type LinkProps } from 'next/link'

import { useRouter } from 'next/navigation'

interface ITransitionLinkProps extends LinkProps {
  children: ReactNode
  href: string
  className?: string
  ref?: Ref<HTMLAnchorElement>
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const TransitionLink = ({
  children,
  href,
  onClick,
  ...props
}: ITransitionLinkProps) => {
  const router = useRouter()

  const handleTransition = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const body = document.querySelector('body')
    body?.classList.add('page-transition')

    await sleep(500)

    if (onClick) onClick(event)

    router.push(href)

    await sleep(500)

    body?.classList.remove('page-transition')
  }

  return (
    <Link {...props} href={href} onClick={handleTransition}>
      {children}
    </Link>
  )
}
