'use client'

import { X } from 'lucide-react'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  forwardRef,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const {
  Root,
  Close,
  Portal,
  Backdrop: Overlay,
  Popup: Content,
  Title,
  Description,
} = SheetPrimitive

const Sheet = Root

const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = Close

const SheetPortal = Portal

const SheetOverlay = forwardRef<
  ComponentRef<typeof Overlay>,
  Omit<ComponentPropsWithoutRef<typeof Overlay>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Overlay
    className={cn(
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className,
    )}
    {...props}
    ref={ref}
  />
))

SheetOverlay.displayName = 'SheetOverlay'

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-closed:duration-300 data-open:duration-500 data-open:animate-in data-closed:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-closed:slide-out-to-top data-open:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-closed:slide-out-to-bottom data-open:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-closed:slide-out-to-left data-open:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-closed:slide-out-to-right data-open:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

type SheetContentProps = Omit<
  ComponentPropsWithoutRef<typeof Content>,
  'className'
> &
  VariantProps<typeof sheetVariants> & { className?: string }

const SheetContent = forwardRef<
  ComponentRef<typeof Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <Close className="ring-offset-background focus:ring-ring data-open:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Close>
      {children}
    </Content>
  </SheetPortal>
))

SheetContent.displayName = 'SheetContent'

const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)

SheetHeader.displayName = 'SheetHeader'

const SheetTitle = forwardRef<
  ComponentRef<typeof Title>,
  Omit<ComponentPropsWithoutRef<typeof Title>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Title
    ref={ref}
    className={cn('text-foreground text-lg font-semibold', className)}
    {...props}
  />
))

SheetTitle.displayName = 'SheetTitle'

const SheetDescription = forwardRef<
  ComponentRef<typeof Description>,
  Omit<ComponentPropsWithoutRef<typeof Description>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
))

SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
