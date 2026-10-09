import { contacts } from '@/data/contacts'

import { useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'

const linkStyle =
  'inline-flex items-center justify-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 will-change-transform flex items-center bg-transparent hover:scale-110 transition-transform duration-300 ease-in-out max-w-max h-9 px-4 py-2'

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
      <a
        href={contacts.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          linkStyle,
          variant === 'light' ? 'text-background' : 'text-foreground',
          className,
        )}
        aria-label={t('facebook-icon')}
      >
        <svg
          width={size}
          height={size}
          aria-hidden="true"
          focusable="false"
        >
          <use href="/icons/sprite.svg#facebook" />
        </svg>
      </a>
      <a
        href={contacts.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          linkStyle,
          variant === 'light' ? 'text-background' : 'text-foreground',
          className,
        )}
        aria-label={t('instagram-icon')}
      >
        <svg
          width={size}
          height={size}
          aria-hidden="true"
          focusable="false"
        >
          <use href="/icons/sprite.svg#instagram" />
        </svg>
      </a>
    </>
  )
}
