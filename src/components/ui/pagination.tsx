'use client'
import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { motion } from 'framer-motion'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center px-2 sm:px-4', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'flex flex-row flex-wrap items-center gap-2 text-base sm:gap-3 sm:text-lg',
      className,
    )}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('cursor-pointer', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
  label?: string
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'> &
  LinkProps

const MotionLink = motion.create(Link)
const PaginationLink = ({
  className,
  isActive,
  href,
  onClick,
  label,
  ...props
}: PaginationLinkProps) => {
  const variants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { type: 'spring', stiffness: 500, damping: 20 },
    },
    tap: {
      scale: 0.95,
      rotate: -5,
      transition: { type: 'spring', stiffness: 500, damping: 20 },
    },
  }

  return (
    <MotionLink
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        buttonVariants({ variant: isActive ? 'none' : 'none' }),
        'font-rubik relative flex items-center justify-center',
        className,
      )}
      href={href}
      onClick={onClick}
      aria-label={label}
    >
      {props.children}
      {isActive && (
        <svg
          role="img"
          aria-label={'active page'}
          className="absolute h-[50px] w-[50px] origin-center sm:h-[70px] sm:w-[70px]"
        >
          <use href="/icons/sprite.svg#o" />
        </svg>
      )}
    </MotionLink>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  disabled,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    label={label}
    size="default"
    className={cn(
      'font-rubik gap-1 pl-2.5',
      disabled && 'pointer-events-none opacity-50',
      className,
    )}
    {...props}
  >
    {'<'}
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  disabled,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label={label}
    aria-disabled={disabled}
    size="default"
    className={cn(
      'gap-1 pr-2.5',
      disabled && 'pointer-events-none opacity-50',
      className,
    )}
    {...props}
  >
    {'>'}
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
