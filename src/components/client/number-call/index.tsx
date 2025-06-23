'use client'

import { contacts } from '@/data/contacts'

import Link from 'next/link'

import { cn } from '@/utils/cn'
import { useTranslations } from 'next-intl'

interface INumberCallProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function NumberCall({
  className,
  variant = 'dark',
}: INumberCallProps) {
  const t = useTranslations('main.header')

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-end gap-x-3 font-medium',
        className,
      )}
      aria-labelledby="number-call"
    >
      <div
        className={cn(
          'shrink-0 transform duration-300 group-hover:scale-110 group-hover:skew-x-[-5deg]',
          variant === 'dark'
            ? 'text-foreground'
            : 'dark:text-foreground text-background',
        )}
      >
        <svg
          width="24px"
          height="24px"
          role="img"
          aria-label={t('telephone-icon')}
        >
          <use href="/icons/sprite.svg#phone" />
        </svg>
      </div>
      <Link
        href={`tel:${contacts.phone}`}
        className="block duration-300 group-hover:skew-x-[-10deg] group-hover:text-red-500"
      >
        {contacts.phone}
      </Link>
    </div>
  )
}
