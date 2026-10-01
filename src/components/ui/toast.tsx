'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import { X } from 'lucide-react'
import { forwardRef, type ReactElement } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const ToastProvider = ToastPrimitive.Provider
const ToastPortal = ToastPrimitive.Portal
const ToastContent = ToastPrimitive.Content

const ToastViewport = forwardRef<
  HTMLDivElement,
  Omit<ToastPrimitive.Viewport.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-100 flex max-h-screen w-full flex-col gap-2 p-4 outline-none sm:top-auto sm:right-0 sm:bottom-0 md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const toastVariants = cva(
  'group pointer-events-auto relative w-full transform-[translate(var(--toast-swipe-movement-x,0px),var(--toast-swipe-movement-y,0px))] overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-[opacity,transform] duration-200 data-[starting-style]:opacity-0 data-[starting-style]:[transform:translateY(-100%)] sm:data-[starting-style]:[transform:translateY(100%)] data-[ending-style]:opacity-0 data-[ending-style]:[transform:translateX(100%)] data-[limited]:hidden',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

const Toast = forwardRef<
  HTMLDivElement,
  Omit<ToastPrimitive.Root.Props, 'className'> &
    VariantProps<typeof toastVariants> & { className?: string }
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    swipeDirection="right"
    {...props}
  />
))
Toast.displayName = 'Toast'

const ToastAction = forwardRef<
  HTMLButtonElement,
  Omit<ToastPrimitive.Action.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'hover:bg-secondary focus:ring-ring inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-1 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = 'ToastAction'

const ToastClose = forwardRef<
  HTMLButtonElement,
  Omit<ToastPrimitive.Close.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    aria-label="Закрити повідомлення"
    className={cn(
      'absolute top-1 right-1 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:outline-none',
      className,
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = 'ToastClose'

const ToastTitle = forwardRef<
  HTMLHeadingElement,
  Omit<ToastPrimitive.Title.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-xl font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = forwardRef<
  HTMLParagraphElement,
  Omit<ToastPrimitive.Description.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-base opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = 'ToastDescription'

type ToastActionElement = ReactElement<ToastPrimitive.Action.Props>

export {
  type ToastActionElement,
  ToastProvider,
  ToastPortal,
  ToastViewport,
  Toast,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
}
