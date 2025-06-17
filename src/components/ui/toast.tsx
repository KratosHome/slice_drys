'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import {
  Provider,
  Viewport,
  Root,
  Action,
  Close,
  Title,
  Description,
} from '@radix-ui/react-toast'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
  forwardRef,
} from 'react'

const ToastProvider = Provider

const ToastViewport = forwardRef<
  ComponentRef<typeof Viewport>,
  ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, ref) => (
  <Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))

ToastViewport.displayName = Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})

Toast.displayName = Root.displayName

const ToastAction = forwardRef<
  ComponentRef<typeof Action>,
  ComponentPropsWithoutRef<typeof Action>
>(({ className, ...props }, ref) => (
  <Action
    ref={ref}
    className={cn(
      'hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-1 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))

ToastAction.displayName = Action.displayName

const ToastClose = forwardRef<
  ComponentRef<typeof Close>,
  ComponentPropsWithoutRef<typeof Close>
>(({ className, ...props }, ref) => (
  <Close
    ref={ref}
    className={cn(
      'absolute·right-1·top-1·rounded-md·p-1·text-foreground/50·opacity-0·transition-opacity·hover:text-foreground·focus:opacity-100·focus:outline-none·focus:ring-1·group-hover:opacity-100·group-[.destructive]:text-red-300·group-[.destructive]:hover:text-red-50·group-[.destructive]:focus:ring-red-400·group-[.destructive]:focus:ring-offset-red-6',
      className,
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="h-4 w-4" />
  </Close>
))

ToastClose.displayName = Close.displayName

const ToastTitle = forwardRef<
  ComponentRef<typeof Title>,
  ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
  <Title
    ref={ref}
    className={cn('text-xl font-semibold [&+div]:text-base', className)}
    {...props}
  />
))

ToastTitle.displayName = Title.displayName

const ToastDescription = forwardRef<
  ComponentRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
  <Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))

ToastDescription.displayName = Description.displayName

type ToastProps = ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
