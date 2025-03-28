import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

import { cn } from '@/utils/cn'

type Props = Readonly<
  {
    label: string
    name: string
    isValid: boolean
    className?: string
    isChecked?: boolean
  } & React.ComponentPropsWithoutRef<'input'>
>

function CheckboxSimple({ name, isValid, isChecked, label, ...props }: Props) {
  return (
    <label
      className="relative flex cursor-pointer select-none items-center space-x-3"
      htmlFor={name}
    >
      <span className="relative mr-4 grid h-[27px] w-[27px] place-items-center">
        <Image src="/icons/checkbox.svg" alt="checkbox" fill />
        <Check size={16} className={cn(isChecked ? 'visible' : 'invisible')} />
        <input
          type="checkbox"
          {...props}
          id={name}
          className={`${isValid ? '' : 'text-red-700'} absolute inset-0 cursor-pointer opacity-0`}
        />
      </span>
      {label}
    </label>
  )
}

export default CheckboxSimple
