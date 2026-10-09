'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { buttonVariants, type ButtonVariantProps } from './button-variants'
import { cn } from '@/utils/cn'

export interface NativeButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {}

// Plain actions use the browser's button semantics; compound controls keep Button.
export const NativeButton = forwardRef<HTMLButtonElement, NativeButtonProps>(
  ({ className, variant, size, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {typeof children === 'string' ? (
        <span className="truncate">{children}</span>
      ) : (
        children
      )}
    </button>
  ),
)

NativeButton.displayName = 'NativeButton'
