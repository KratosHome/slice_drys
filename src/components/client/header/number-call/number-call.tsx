import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { useTranslations } from 'next-intl'

interface NumberCallProps {
  className?: string
}

const NumberCall: FC<NumberCallProps> = ({ className }) => {
  const t = useTranslations('main.header')

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-end gap-x-3 font-medium',
        className,
      )}
    >
      <div className="transform duration-300 group-hover:skew-x-[-5deg] group-hover:scale-110">
        <Image
          src={'/icons/tel.svg'}
          alt={`${t('telephone-icon')}`}
          width={24}
          height={24}
        />
      </div>
      <Link
        href="tel:+380123456789"
        className="group-hover:text-red block duration-300 group-hover:skew-x-[-10deg]"
      >
        +380123456789
      </Link>
    </div>
  )
}

export default NumberCall
