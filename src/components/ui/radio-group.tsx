import { Root, Item, Indicator } from '@radix-ui/react-radio-group'
import { cva, type VariantProps } from 'class-variance-authority'

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/utils/cn'

const RadioGroup = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  return <Root className={cn('grid gap-2', className)} {...props} ref={ref} />
})

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
    <Item
      ref={ref}
      className={cn(
        'border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow-sm focus:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <Indicator className="flex items-center justify-center">
        <CheckIcon className={cn('fill-primary', radioStyles({ iconSize }))} />
      </Indicator>
    </Item>
  )
})

RadioGroupItem.displayName = Item.displayName

export { RadioGroup, RadioGroupItem }
