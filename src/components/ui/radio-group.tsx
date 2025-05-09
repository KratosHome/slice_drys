'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/utils/cn'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioStyles = cva('', {
  variants: {
    iconSize: {
      default: 'h-3.5 w-3.5 ',
      large: 'h-4.5 w-4.5',
    },
  },
  defaultVariants: {
    iconSize: 'default',
  },
})

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioStyles>
>(({ className, iconSize, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'border-foreground text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow-sm focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className={cn('fill-primary', radioStyles({ iconSize }))} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
