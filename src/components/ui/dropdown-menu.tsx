'use client'

import { Check } from 'lucide-react'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from 'react'
import { cn } from '@/utils/cn'

const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger

type DropdownMenuContentProps = Omit<
  ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>,
  'className'
> &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & { className?: string }

const DropdownMenuContent = forwardRef<
  ComponentRef<typeof MenuPrimitive.Popup>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      align = 'center',
      alignOffset = 0,
      side = 'bottom',
      sideOffset = 4,
      ...props
    },
    ref,
  ) => (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          ref={ref}
          data-slot="dropdown-menu-content"
          className={cn(
            'bg-popover text-popover-foreground z-50 min-w-[8rem] origin-(--transform-origin) overflow-hidden rounded-md border p-1 shadow-md',
            'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  ),
)

DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  Omit<
    ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>,
    'className'
  > & { className?: string }
>(({ className, children, checked, closeOnClick = true, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    checked={checked}
    closeOnClick={closeOnClick}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuPrimitive.CheckboxItemIndicator>
        <Check className="h-4 w-4" />
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
))

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
}
