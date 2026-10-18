'use client'

import {
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
  type ElementType,
  useRef,
  useEffect,
} from 'react'
import { cn } from '@/utils/cn'

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: ReactNode
  className?: string
  containerClassName?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const supportsHover = useRef(false)

  useEffect(() => {
    const media = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )
    const update = () => {
      supportsHover.current = media.matches
      if (!media.matches) {
        if (containerRef.current) containerRef.current.style.transform = 'none'
      }
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    if (!containerRef.current || !supportsHover.current) return

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect()

    const x: number = (event.clientX - left - width / 2) / 25
    const y: number = (event.clientY - top - height / 2) / 25

    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
  }

  const handleMouseLeave = (): void => {
    if (!containerRef.current) return

    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`
  }

  return (
    <div
      className={cn('flex h-full w-full', containerClassName)}
      style={{
        perspective: '1000px',
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'card-depth-surface',
          'relative transition-all duration-200 ease-linear',
          className,
        )}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const CardBody = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        '[transform-style:preserve-3d] *:[transform-style:preserve-3d]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const CardItem = ({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
}) => {
  return (
    <Tag
      className={cn(
        'card-depth-item',
        'transition duration-200 ease-linear',
        className,
      )}
      style={
        {
          '--card-item-transform': `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  )
}
