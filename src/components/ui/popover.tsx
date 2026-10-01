'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from 'react'
import { cn } from '@/utils/cn'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

type PopoverContentProps = Omit<
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup>,
  'className'
> &
  Pick<
    PopoverPrimitive.Positioner.Props,
    | 'align'
    | 'alignOffset'
    | 'side'
    | 'sideOffset'
    | 'anchor'
    | 'collisionPadding'
  > & { className?: string }

const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(
  (
    {
      className,
      align = 'center',
      alignOffset = 0,
      side = 'bottom',
      sideOffset = 4,
      anchor,
      collisionPadding,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        className="isolate z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
      >
        <PopoverPrimitive.Popup
          ref={ref}
          data-slot="popover-content"
          className={cn(
            'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  ),
)

PopoverContent.displayName = 'PopoverContent'
export { Popover, PopoverTrigger, PopoverContent }
