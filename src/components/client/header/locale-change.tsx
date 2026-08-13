'use client'

import { TransitionLink } from '@/components/client/transition-link'

import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { useLocale } from 'next-intl'
import { useSyncExternalStore } from 'react'

interface ILocaleChangeProps {
  className?: string
}

const subscribeToLocation = (onStoreChange: () => void) => {
  window.addEventListener('popstate', onStoreChange)
  return () => window.removeEventListener('popstate', onStoreChange)
}

const getLocationSearch = () => window.location.search
const getServerLocationSearch = () => ''

export default function LocaleChange({ className }: ILocaleChangeProps) {
  const locale: string = useLocale()
  const path: string = usePathname()
  const search = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerLocationSearch,
  )

  return (
    <div
      className={cn('flex items-center text-sm', className)}
      aria-labelledby="locale-change"
    >
      <TransitionLink
        href={`${getLocalizedPath('uk', path)}${search}`}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'uk' && 'text-red-500',
        )}
      >
        UK
      </TransitionLink>
      <span className="-mt-[2px] text-xl font-semibold">&#8201;/&#8201;</span>
      <TransitionLink
        href={`${getLocalizedPath('en', path)}${search}`}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'en' && 'text-red-500',
        )}
      >
        EN
      </TransitionLink>
    </div>
  )
}
