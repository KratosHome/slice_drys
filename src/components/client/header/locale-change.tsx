'use client'

import { TransitionLink } from '@/components/client/transition-link'

import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { getLocalizedPath } from '@/utils/get-localized-path'
import { useLocale } from 'next-intl'

interface ILocaleChangeProps {
  className?: string
}

export default function LocaleChange({ className }: ILocaleChangeProps) {
  const locale: string = useLocale()
  const path: string = usePathname()

  return (
    <div
      className={cn('flex items-center text-sm', className)}
      aria-labelledby="locale-change"
    >
      <TransitionLink
        href={getLocalizedPath('uk', path)}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'uk' && 'text-red-700',
        )}
      >
        UK
      </TransitionLink>
      <span className="-mt-[2px] text-xl font-semibold">&#8201;/&#8201;</span>
      <TransitionLink
        href={getLocalizedPath('en', path)}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'en' && 'text-red-700',
        )}
      >
        EN
      </TransitionLink>
    </div>
  )
}
