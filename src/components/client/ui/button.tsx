import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  'group relative cursor-pointer font-semibold transition duration-300',
  {
    variants: {
      variant: {
        default: 'bg-black text-white',
        button:
          'bg-black text-white md:h-[40px] md:w-[150px] xl:h-[50px] xl:w-[180px] lg:!text-[20px] hover:skew-x-[-10deg] hover:bg-red hover:font-semibold h-[30px] w-[88px] !text-[14px] font-medium',
        icons:
          'flex items-center bg-transparent hover:scale-110 transition-transform duration-300 ease-in-out max-w-max',
        yellow:
          'rounded-lg bg-yellow-500 text-white px-6 py-2 font-medium transition-all hover:scale-105 duration-300 hover:bg-yellow-600 hover:shadow-lg',
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
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size, className }))}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
