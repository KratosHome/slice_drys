'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'

import { forwardRef } from 'react'
import { buttonVariants, type ButtonVariantProps } from './button-variants'
import { cn } from '@/utils/cn'

export interface IButtonProps
  extends
    Omit<ButtonPrimitive.Props, 'className'>,
    ButtonVariantProps {
  className?: string
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {typeof children === 'string' ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
      </ButtonPrimitive>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
