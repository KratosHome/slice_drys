import { ReactNode } from 'react'
import { LazyMotion, domAnimation, m, MotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useIsMobile } from '@/hooks/use-mobile'

interface ResponsiveMotionProps extends MotionProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const ResponsiveMotion = ({
  children,
  className,
  onClick,
  ...motionProps
}: ResponsiveMotionProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className={cn(`block ${className}`)} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={cn(`block ${className}`)}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
