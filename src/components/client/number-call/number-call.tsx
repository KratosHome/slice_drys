import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/cn'

interface NumberCallProps {
  className?: string
}

const NumberCall: FC<NumberCallProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-end gap-x-3 font-medium',
        className,
      )}
    >
      <div className="transform duration-300 group-hover:skew-x-[-5deg] group-hover:scale-110">
        <Image src={'/icons/tel.svg'} alt="tel icon" width={24} height={24} />
      </div>
      <Link
        href="tel:+380123456789"
        className="block duration-300 group-hover:skew-x-[-10deg] group-hover:text-red"
      >
        +380123456789
      </Link>
    </div>
  )
}

export default NumberCall
