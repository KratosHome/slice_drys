'use client'

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  forwardRef,
  useCallback,
  useRef,
} from 'react'
import { cn } from '@/utils/cn'
import { buttonVariants } from '@/components/ui/button'

const {
  Root,
  Trigger,
  Portal,
  Backdrop: Overlay,
  Popup: Content,
  Title,
  Description,
  Close: Action,
} = AlertDialogPrimitive
const Cancel = AlertDialogPrimitive.Close

const AlertDialog = Root

const AlertDialogTrigger = Trigger

const AlertDialogPortal = Portal

const AlertDialogOverlay = forwardRef<
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
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

const AlertDialogContent = forwardRef<
  ComponentRef<typeof Content>,
  Omit<ComponentPropsWithoutRef<typeof Content>, 'className'> & {
    className?: string
  }
>(({ className, initialFocus, ...props }, ref) => {
  const popupRef = useRef<HTMLDivElement | null>(null)
  const setPopupRef = useCallback(
    (element: HTMLDivElement | null) => {
      popupRef.current = element
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    },
    [ref],
  )

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <Content
        ref={setPopupRef}
        initialFocus={
          initialFocus ??
          (() =>
            popupRef.current?.querySelector<HTMLElement>(
              '[data-slot="alert-dialog-cancel"]',
            ) ?? true)
        }
        className={cn(
          'bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-closed:slide-out-to-left-1/2 data-closed:slide-out-to-top-[48%] data-open:slide-in-from-left-1/2 data-open:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
})

AlertDialogContent.displayName = 'AlertDialogContent'

const AlertDialogHeader = ({
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

AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)

AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = forwardRef<
  ComponentRef<typeof Title>,
  Omit<ComponentPropsWithoutRef<typeof Title>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))

AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = forwardRef<
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

AlertDialogDescription.displayName = 'AlertDialogDescription'

const AlertDialogAction = forwardRef<
  ComponentRef<typeof Action>,
  Omit<ComponentPropsWithoutRef<typeof Action>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Action
    ref={ref}
    data-slot="alert-dialog-action"
    className={cn(buttonVariants(), className)}
    {...props}
  />
))

AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = forwardRef<
  ComponentRef<typeof Cancel>,
  Omit<ComponentPropsWithoutRef<typeof Cancel>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Cancel
    ref={ref}
    data-slot="alert-dialog-cancel"
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'mt-2 sm:mt-0',
      className,
    )}
    {...props}
  />
))

AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
