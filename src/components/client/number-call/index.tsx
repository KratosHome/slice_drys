'use client'

import { contacts } from '@/data/contacts'

import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/utils/cn'
import { useTranslations } from 'next-intl'

interface INumberCallProps {
  className?: string
  variant?: 'light' | 'dark'
}

const NumberCall = ({ className, variant = 'dark' }: INumberCallProps) => {
  const t = useTranslations('main.header')

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-end gap-x-3 font-medium',
        className,
      )}
    >
      <div
        className={cn(
          'shrink-0 transform duration-300 group-hover:skew-x-[-5deg] group-hover:scale-110',
          variant === 'light' ? '[filter:invert(1)]' : '[filter:invert(0)]',
        )}
      >
        <Image
          src="/icons/tel.svg"
          alt={`${t('telephone-icon')}`}
          width={24}
          height={24}
        />
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

export default NumberCall
