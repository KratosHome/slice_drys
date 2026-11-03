import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import styles from './responsive-motion.module.css'

interface IResponsiveMotionProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'button' | 'quantity' | 'accordion' | 'card'
}

export const ResponsiveMotion = ({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'button',
}: IResponsiveMotionProps) => {
  return (
    <div
      className={cn('block', styles.motion, styles[variant], className)}
      onClick={onClick}
      data-motion-disabled={disabled || undefined}
    >
      {children}
    </div>
  )
}
