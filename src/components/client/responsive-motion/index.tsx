'use client'

import type { ReactNode } from 'react'

import { LazyMotion, domAnimation, m, type MotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useIsMobile } from '@/hooks/useMobile'

interface IResponsiveMotionProps extends MotionProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export const ResponsiveMotion = ({
  children,
  className,
  onClick,
  disabled = false,
  ...motionProps
}: IResponsiveMotionProps) => {
  const isMobile = useIsMobile()

  if (isMobile || disabled) {
    return (
      <div className={cn('block', className)} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={cn('block', className)}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
