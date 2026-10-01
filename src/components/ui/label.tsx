'use client'

import { type ComponentProps, forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Label = forwardRef<HTMLLabelElement, ComponentProps<'label'>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-70',
        className,
      )}
      {...props}
    />
  ),
)
Label.displayName = 'Label'
export { Label }
