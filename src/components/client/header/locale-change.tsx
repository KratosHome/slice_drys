'use client'

import { TransitionLink } from '@/components/client/transition-link'

import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { useLocale } from 'next-intl'
import { Suspense } from 'react'

interface ILocaleChangeProps {
  className?: string
  onNavigate?: () => void
}

export default function LocaleChange({
  className,
  onNavigate,
}: ILocaleChangeProps) {
  return (
    <Suspense fallback={null}>
      <LocaleChangeLinks className={className} onNavigate={onNavigate} />
    </Suspense>
  )
}

function LocaleChangeLinks({ className, onNavigate }: ILocaleChangeProps) {
  const locale: string = useLocale()
  const path: string = usePathname()
  const query = useSearchParams().toString()
  const search = query ? `?${query}` : ''

  return (
    <div className={cn('flex items-center text-sm', className)}>
      <TransitionLink
        href={`${getLocalizedPath('uk', path)}${search}`}
        onNavigate={onNavigate}
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
        onNavigate={onNavigate}
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
