'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { CheckIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

function RadioGroup<Value>({
  className,
  ...props
}: Omit<RadioGroupPrimitive.Props<Value>, 'className'> & {
  className?: string
}) {
  return (
    <RadioGroupPrimitive className={cn('grid gap-2', className)} {...props} />
  )
}
const radioStyles = cva('', {
  variants: { iconSize: { default: 'h-3.5 w-3.5', large: 'h-4.5 w-4.5' } },
  defaultVariants: { iconSize: 'default' },
})
const RadioGroupItem = forwardRef<
  HTMLSpanElement,
  Omit<RadioPrimitive.Root.Props, 'className'> & {
    className?: string
  } & VariantProps<typeof radioStyles>
>(({ className, iconSize, ...props }, ref) => (
  <RadioPrimitive.Root
    ref={ref}
    className={cn(
      'border-foreground text-primary focus-visible:ring-ring relative inline-flex aspect-square h-4 w-4 items-center justify-center rounded-full border shadow-sm focus-visible:ring-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <RadioPrimitive.Indicator className="flex items-center justify-center">
      <CheckIcon className={cn('fill-none', radioStyles({ iconSize }))} />
    </RadioPrimitive.Indicator>
  </RadioPrimitive.Root>
))
RadioGroupItem.displayName = 'RadioGroupItem'
export { RadioGroup, RadioGroupItem }
