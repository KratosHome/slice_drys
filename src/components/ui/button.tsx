'use client'

import { Slot } from '@radix-ui/react-slot'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 will-change-transform',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        button:
          'bg-foreground text-background rounded-none md:h-[40px] xl:h-[50px] px-[10px] lg:text-[20px] hover:enabled:skew-x-[-10deg] hover:enabled:bg-red-cust h-[30px] text-[14px] font-medium  transition-all',
        icons:
          'flex items-center bg-transparent hover:scale-110 transition-transform duration-300 ease-in-out max-w-max',
        yellow:
          'rounded-lg bg-yellow-500 text-white px-6 py-2 font-medium transition-all hover:scale-105 duration-300 hover:bg-yellow-600 hover:shadow-lg',
        transparent:
          'text-background rounded-none text-[18px] lg:text-[20px] hover:skew-x-[-10deg] font-semibold border-background border-2 p-[16px_20px] leading-[1] transition-all',
        danger:
          'text-nowrap text-[18px] bg-red-cust px-9 py-2.5 text-xl font-semibold tracking-wider text-white transition-all hover:brightness-90 hover:saturate-150 hover:scale-105 hover:shadow-lg',
        none: '',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {typeof children === 'string' ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
