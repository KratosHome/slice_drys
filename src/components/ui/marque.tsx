'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx/lite'

/**
 * It displays a marquee of elements and loops through them.
 */

interface IMarqueeProps {
  className?: string
  innerClassName?: string
  children?: ReactNode
  withBackground?: boolean
  animationDurationInSeconds?: number
  animationDirection?: 'left' | 'right'
  variant?: 'primary' | 'secondary'
}

export const Marquee = ({
  className,
  children,
  innerClassName,
  withBackground = false,
  animationDurationInSeconds,
  animationDirection,
  variant = 'primary',
}: IMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [repeat, setRepeat] = useState<number>(3) // Initial value, can be adjusted
  const [_animationDuration, _setAnimationDuration] = useState<string>('15s') // Initial value

  useEffect(() => {
    const updateRepeatCount = (): void => {
      if (containerRef.current) {
        const containerWidth: number = containerRef.current.offsetWidth
        const firstChild = containerRef.current.firstChild as HTMLElement | null
        const grandChild = firstChild?.firstChild as HTMLElement | null
        const childWidth: number = grandChild?.offsetWidth || 1
        const visibleItems: number = Math.ceil(containerWidth / childWidth)
        setRepeat(visibleItems + 1) // Adding extra to ensure smooth loop

        if (animationDurationInSeconds) {
          _setAnimationDuration(`${animationDurationInSeconds}s`)
        } else {
          // Update animation duration based on container width
          const duration: number = (containerWidth / 100) * 15
          _setAnimationDuration(`${duration}s`)
        }
      }
    }

    updateRepeatCount()
    window.addEventListener('resize', updateRepeatCount)
    return () => window.removeEventListener('resize', updateRepeatCount)
  }, [animationDurationInSeconds])

  return (
    <div
      className={clsx(
        'flex w-full items-center overflow-hidden',
        withBackground && variant === 'primary'
          ? 'bg-primary-100/20 dark:bg-primary-900/10'
          : '',
        withBackground && variant === 'secondary'
          ? 'bg-secondary-100/20 dark:bg-secondary-900/10'
          : '',
        className,
      )}
      ref={containerRef}
    >
      <div
        className={clsx(
          'animate-marquee flex',
          animationDirection === 'left' ? 'direction-reverse' : '',
          innerClassName,
        )}
        style={{
          width: `${repeat * 100}%`,
          animationDuration: _animationDuration,
        }}
      >
        {/* Render 3x for seamless looping */}
        {Array.from({ length: repeat }, () => children)
          .flat()
          .map((child, index) => (
            <div
              key={index}
              className="flex shrink-0 items-center justify-center"
            >
              {child}
            </div>
          ))}
      </div>
    </div>
  )
}
