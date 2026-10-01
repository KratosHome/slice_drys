'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from 'react'
import { cn } from '@/utils/cn'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipContentProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>,
  'className'
> &
  Pick<
    TooltipPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & { className?: string }

const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Popup>,
  TooltipContentProps
>(
  (
    {
      className,
      align = 'center',
      alignOffset = 0,
      side = 'top',
      sideOffset = 4,
      ...props
    },
    ref,
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        className="isolate z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          ref={ref}
          data-slot="tooltip-content"
          className={cn(
            'bg-primary text-primary-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--transform-origin) overflow-hidden rounded-md px-3 py-1.5 text-xs',
            className,
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  ),
)

TooltipContent.displayName = 'TooltipContent'
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
