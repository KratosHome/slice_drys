'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { forwardRef, type ReactNode, useCallback, useState } from 'react'
import { cn } from '@/utils/cn'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  Omit<SelectPrimitive.Trigger.Props, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1 text-sm whitespace-nowrap shadow-xs focus:ring-1 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon
      render={<ChevronDownIcon className="h-4 w-4 opacity-50" />}
    />
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectContent = forwardRef<
  HTMLDivElement,
  Omit<SelectPrimitive.Popup.Props, 'className'> & {
    className?: string
    positionerClassName?: string
    scrollDownIcon?: ReactNode
  } & Pick<
      SelectPrimitive.Positioner.Props,
      'side' | 'sideOffset' | 'align' | 'alignOffset' | 'alignItemWithTrigger'
    >
>(
  (
    {
      className,
      positionerClassName,
      scrollDownIcon,
      children,
      side = 'bottom',
      sideOffset = 4,
      align = 'center',
      alignOffset = 0,
      alignItemWithTrigger = false,
      ...props
    },
    ref,
  ) => {
    const [showScrollArrows, setShowScrollArrows] = useState(true)
    const minimumArrowViewport = scrollDownIcon ? 112 : 88
    const observeListSize = useCallback(
      (element: HTMLDivElement | null) => {
        if (!element) return

        // Tiny viewports cannot fit both arrow bars and a complete option.
        // Leave their full area available for native keyboard/touch scrolling.
        const update = () =>
          setShowScrollArrows(element.clientHeight >= minimumArrowViewport)
        const observer = new ResizeObserver(update)
        update()
        observer.observe(element)
        return () => observer.disconnect()
      },
      [minimumArrowViewport],
    )

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          alignItemWithTrigger={alignItemWithTrigger}
          className={cn('isolate z-50', positionerClassName)}
        >
          <SelectPrimitive.Popup
            ref={ref}
            data-slot="select-content"
            className={cn(
              'bg-popover text-popover-foreground data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[max(8rem,var(--anchor-width))] origin-[var(--transform-origin)] overflow-hidden rounded-md border shadow-md',
              className,
            )}
            {...props}
          >
            <SelectPrimitive.ScrollUpArrow
              className="absolute inset-x-0 top-0 z-10 flex cursor-default items-center justify-center bg-inherit py-1"
              style={{ display: showScrollArrows ? undefined : 'none' }}
            >
              <ChevronUpIcon className="h-4 w-4" />
            </SelectPrimitive.ScrollUpArrow>
            <SelectPrimitive.List
              ref={observeListSize}
              className={cn(
                'relative max-h-[min(24rem,var(--available-height))] overflow-y-auto p-1',
                showScrollArrows
                  ? scrollDownIcon
                    ? 'scroll-pt-6 scroll-pb-12'
                    : 'scroll-py-6'
                  : 'scroll-py-1',
              )}
            >
              {children}
            </SelectPrimitive.List>
            <SelectPrimitive.ScrollDownArrow
              className="group absolute inset-x-0 bottom-0 z-10 flex cursor-default items-center justify-center bg-inherit py-1"
              style={{ display: showScrollArrows ? undefined : 'none' }}
            >
              {scrollDownIcon ?? <ChevronDownIcon className="h-4 w-4" />}
            </SelectPrimitive.ScrollDownArrow>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    )
  },
)
SelectContent.displayName = 'SelectContent'

const SelectLabel = forwardRef<
  HTMLDivElement,
  Omit<SelectPrimitive.GroupLabel.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

const SelectItem = forwardRef<
  HTMLDivElement,
  Omit<SelectPrimitive.Item.Props, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <CheckIcon className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
}
