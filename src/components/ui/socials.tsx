'use client'

import React from 'react'

import { contacts } from '@/data/contacts'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'

function Socials({
  variant = 'dark',
  size = 33,
  className,
}: {
  variant?: 'light' | 'dark'
  size?: number
  className?: string
}) {
  const t = useTranslations('main.header')
  return (
    <>
      <Button
        variant={'icons'}
        onClick={() =>
          window.open(contacts.facebook, '_blank', 'noopener,noreferrer')
        }
        className={cn(
          variant === 'light' ? 'text-background' : 'text-foreground',
          className,
        )}
      >
        <svg
          width={size}
          height={size}
          role="img"
          aria-label={t('facebook-icon')}
        >
          <use href="/icons/sprite.svg#facebook"></use>
        </svg>
      </Button>
      <Button
        variant={'icons'}
        onClick={() =>
          window.open(contacts.instagram, '_blank', 'noopener,noreferrer')
        }
        className={cn(
          variant === 'light' ? 'text-background' : 'text-foreground',
          className,
        )}
      >
        <svg
          width={size}
          height={size}
          role="img"
          aria-label={t('instagram-icon')}
        >
          <use href="/icons/sprite.svg#instagram"></use>
        </svg>
      </Button>
    </>
  )
}

export default Socials
