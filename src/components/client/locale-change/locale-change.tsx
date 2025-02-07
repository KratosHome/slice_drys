'use client'
import { FC } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { useLocale } from 'next-intl'

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
      <Link
        href={getLocalizedPath('uk')}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'uk' && 'text-red',
        )}
      >
        UK
      </Link>

      <span className="-mt-[2px] text-xl font-semibold">&#8201;/&#8201;</span>

      <Link
        href={getLocalizedPath('en')}
        className={cn(
          'inline-block text-[16px] font-normal duration-300 hover:scale-110',
          locale === 'en' && 'text-red',
        )}
      >
        EN
      </Link>
    </div>
  )
}

export default LocaleChange
