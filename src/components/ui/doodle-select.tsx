'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import {
  SelectContent as BaseSelectContent,
  SelectItem as BaseSelectItem,
} from '@/components/ui/select'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectLabel,
} from '@/components/ui/select'

const DoodleChevron = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    {...props}
    className={cn(
      'font-rubik flex shrink-0 rotate-90 items-center justify-center text-xl transition-all duration-200 will-change-transform group-hover:scale-110 group-hover:text-red-700 sm:text-2xl md:text-4xl',
      className,
    )}
  >
    {'>'}
  </span>
)

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  Omit<SelectPrimitive.Trigger.Props, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'border-input placeholder:text-muted-foreground focus:ring-ring flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs focus:ring-1 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&[data-popup-open]>span]:last:text-red-700 [&[data-popup-open]>span]:last:opacity-0',
      'bg-grey-select group flex w-fit gap-4 rounded-sm px-3 py-2 text-2xl font-bold',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon render={<DoodleChevron />} />
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'DoodleSelectTrigger'

const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof BaseSelectContent>
>((props, ref) => (
  <BaseSelectContent ref={ref} scrollDownIcon={<DoodleChevron />} {...props} />
))
SelectContent.displayName = 'DoodleSelectContent'

const SelectItem = forwardRef<
  HTMLDivElement,
  Omit<SelectPrimitive.Item.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <BaseSelectItem
    ref={ref}
    className={cn('cursor-pointer', className)}
    {...props}
  />
))
SelectItem.displayName = 'DoodleSelectItem'
export { SelectTrigger, SelectContent, SelectItem }
