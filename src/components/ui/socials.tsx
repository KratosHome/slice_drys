'use client'

import { contacts } from '@/data/contacts'

import { Button } from '@/components/ui/button'

import { useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'

interface ISocialProps {
  variant?: 'light' | 'dark'
  size?: number
  className?: string
}

export default function Socials({
  variant = 'dark',
  size = 33,
  className,
}: ISocialProps) {
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
          <use href="/icons/sprite.svg#facebook" />
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
          <use href="/icons/sprite.svg#instagram" />
        </svg>
      </Button>
    </>
  )
}
