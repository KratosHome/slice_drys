'use client'

import type { ReactNode } from 'react'
import { contacts } from '@/data/contacts'
import { trackContactClick } from '@/utils/analytics'

export default function ContactLink({
  method,
  children,
  className,
  onClick,
}: {
  method: 'email' | 'phone'
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <a
      href={
        method === 'email' ? `mailto:${contacts.mail}` : `tel:${contacts.phone}`
      }
      className={className}
      onClick={() => {
        trackContactClick(method)
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}
