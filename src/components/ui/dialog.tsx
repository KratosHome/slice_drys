'use client'

import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import dialogMotionStyles from './dialog-motion.module.css'

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  forwardRef,
} from 'react'
import { cn } from '@/utils/cn'

const {
  Root,
  Trigger,
  Portal,
  Close,
  Backdrop: Overlay,
  Popup: Content,
  Title,
  Description,
} = DialogPrimitive

const Dialog = Root

const DialogTrigger = Trigger

const DialogPortal = Portal

const DialogOverlay = forwardRef<
  ComponentRef<typeof Overlay>,
  Omit<ComponentPropsWithoutRef<typeof Overlay>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Overlay
    ref={ref}
    className={cn(
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className,
    )}
    {...props}
  />
))

DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = forwardRef<
  ComponentRef<typeof Content>,
  Omit<ComponentPropsWithoutRef<typeof Content>, 'className'> & {
    className?: string
  }
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <Content
      ref={ref}
      className={cn(
        'bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-closed:slide-out-to-left-1/2 data-closed:slide-out-to-top-[48%] data-open:slide-in-from-left-1/2 data-open:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border p-6 shadow-lg duration-200 sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <Close className="ring-offset-background focus:ring-ring data-open:text-red-cust absolute top-3 right-3 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-open:bg-transparent">
        <X className="text-red-cust h-8 w-8" />
        <span className="sr-only">Close</span>
      </Close>
    </Content>
  </DialogPortal>
))

DialogContent.displayName = 'DialogContent'

const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)

DialogHeader.displayName = 'DialogHeader'

const AnimatedDialogContent = forwardRef<
  ComponentRef<typeof Content>,
  Omit<ComponentPropsWithoutRef<typeof Content>, 'className'> & {
    className?: string
  } & {
    overlayClassName?: string
    showCloseButton?: boolean
  }
>(
  (
    { className, children, overlayClassName, showCloseButton = true, ...props },
    ref,
  ) => (
    <DialogPortal>
      <Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/80',
          dialogMotionStyles.overlay,
          overlayClassName,
        )}
      />
      <Content
        ref={ref}
        className={cn(
          'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg border p-6 shadow-lg sm:rounded-lg',
          dialogMotionStyles.content,
          className,
        )}
        {...props}
      >
        <div className={dialogMotionStyles.reveal}>
          <div className={dialogMotionStyles.surface}>
            {children}
            {showCloseButton ? (
              <Close className="ring-offset-background focus:ring-ring data-open:text-red-cust absolute top-3 right-3 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-open:bg-transparent">
                <X className="text-red-cust h-8 w-8" />
                <span className="sr-only">Close</span>
              </Close>
            ) : null}
          </div>
        </div>
      </Content>
    </DialogPortal>
  ),
)

AnimatedDialogContent.displayName = 'AnimatedDialogContent'

const ClientDialogHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-between space-y-1.5', className)}
    {...props}
  >
    {children}
    <Close
      aria-label="Close"
      className={cn(
        'ring-offset-background focus:ring-ring data-open:text-red-cust cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-open:bg-transparent',
        dialogMotionStyles.closeButton,
      )}
    >
      <div
        className={cn(
          'text-red-cust cursor-pointer',
          dialogMotionStyles.closeIcon,
        )}
      >
        <svg
          className="h-8 w-8 md:h-12 md:w-12"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/icons/sprite.svg#close" />
        </svg>
      </div>
    </Close>
  </div>
)

ClientDialogHeader.displayName = 'ClientDialogHeader'

const DialogFooter = ({
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

DialogFooter.displayName = 'DialogFooter'

const DialogTitle = forwardRef<
  ComponentRef<typeof Title>,
  Omit<ComponentPropsWithoutRef<typeof Title>, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <Title
    ref={ref}
    className={cn(
      'text-lg leading-none font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
))

DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef<
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

DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  AnimatedDialogContent,
  ClientDialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
