'use client'

import { TransitionLink } from '@/components/client/transition-link'

import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { useLocale } from 'next-intl'
import { Suspense } from 'react'

interface ILocaleChangeProps {
  className?: string
}

export default function LocaleChange({ className }: ILocaleChangeProps) {
  return (
    <Suspense fallback={null}>
      <LocaleChangeLinks className={className} />
    </Suspense>
  )
}

function LocaleChangeLinks({ className }: ILocaleChangeProps) {
  const locale: string = useLocale()
  const path: string = usePathname()
  const query = useSearchParams().toString()
  const search = query ? `?${query}` : ''

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
