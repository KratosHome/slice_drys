import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  'group relative cursor-pointer font-semibold transition duration-300 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-black text-white',
        button:
          'bg-black text-white md:h-[40px] xl:h-[50px] px-[10px] lg:!text-[20px] hover:enabled:skew-x-[-10deg] hover:enabled:bg-red-500 hover:enabled:font-semibold h-[30px] !text-[14px] font-medium will-change-transform',
        icons:
          'flex items-center bg-transparent hover:scale-110 transition-transform duration-300 ease-in-out max-w-max',
        yellow:
          'rounded-lg bg-yellow-500 text-white px-6 py-2 font-medium transition-all hover:scale-105 duration-300 hover:bg-yellow-600 hover:shadow-lg',
        transparent:
          ' text-white !text-[18px] lg:!text-[20px] hover:skew-x-[-10deg] font-semibold border-white border-2 p-[16px_20px] leading-[1]',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        danger:
          'text-nowrap !text-[18px] bg-red-500 px-9 py-2.5 text-xl font-semibold tracking-wider text-white transition-all hover:brightness-90 hover:saturate-150 hover:scale-105 hover:shadow-lg',
      },
      size: {
        xl: 'text-xl lap:text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'xl',
    },
  },
)

interface ButtonProps
  extends VariantProps<typeof buttonStyles>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'submit' | 'reset' | 'button' | undefined
  className?: string
  children: ReactNode
  onClick?: () => void
}

export default function Button({
  variant,
  size,
  type,
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size }), className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
