import { cn } from '@/utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

const buttonStyles = cva(
  'group relative cursor-pointer font-semibold transition duration-300',
  {
    variants: {
      variant: {
        default: 'bg-black text-white',
        button:
          'bg-black text-white md:h-[40px] md:w-[150px] xl:h-[50px] xl:w-[180px] lg:!text-[20px] hover:skew-x-[-10deg] hover:bg-red hover:font-semibold h-[30px] w-[88px] !text-[14px] font-medium',
        icons:
          'flex items-center bg-transparent hover:scale-110 transition-transform duration-300 ease-in-out hover:bg-gray-200 max-w-max',
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

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  type?: 'submit' | 'reset' | 'button' | undefined
  className?: string
  children: React.ReactNode
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
