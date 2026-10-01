'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckIcon, MinusIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Checkbox = forwardRef<
  HTMLSpanElement,
  Omit<CheckboxPrimitive.Root.Props, 'className'> & { className?: string }
>(({ className, indeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    indeterminate={indeterminate}
    className={cn(
      'peer border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border shadow-sm focus-visible:ring-1 focus-visible:outline-hidden data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {indeterminate ? (
        <MinusIcon className="h-4 w-4" />
      ) : (
        <CheckIcon className="h-4 w-4" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'
export { Checkbox }
