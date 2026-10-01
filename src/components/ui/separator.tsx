'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Separator = forwardRef<
  HTMLDivElement,
  Omit<SeparatorPrimitive.Props, 'className'> & { className?: string }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    orientation={orientation}
    className={cn(
      'bg-border shrink-0',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className,
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'
export { Separator }
