'use client'
import { FC } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { useLocale } from 'next-intl'
import { TransitionLink } from '@/components/client/transition-link/transition-link'

interface LocaleChangeP {
  className?: string
}

const LocaleChange: FC<LocaleChangeP> = ({ className }) => {
  const locale = useLocale()
  const path = usePathname()

  const getLocalizedPath = (newLocale: string) => {
    const pathWithoutLocale = path.replace(/^\/(uk|en)/, '')
    return `/${newLocale}${pathWithoutLocale}`
  }

  return (
    <div className={cn('flex items-center text-sm', className)}>
      <TransitionLink
        href={getLocalizedPath('uk')}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'uk' && 'text-red-700',
        )}
      >
        UK
      </TransitionLink>

      <span className="-mt-[2px] text-xl font-semibold">&#8201;/&#8201;</span>

      <TransitionLink
        href={getLocalizedPath('en')}
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

export default LocaleChange
