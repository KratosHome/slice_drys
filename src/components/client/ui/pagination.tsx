'use client'
import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ButtonProps, buttonVariants } from '@/components/admin/ui/button'
import Image from 'next/image'

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
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'> &
  LinkProps

const MotionLink = motion.create(Link)
const PaginationLink = ({
  className,
  isActive,
  href,
  onClick,
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
        className,
      )}
      href={href}
      onClick={onClick}
    >
      {isActive ? (
        <div className="relative mt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r"
          />
          <Image
            src="/icons/o.svg"
            alt="icon"
            width={50}
            height={50}
            className="object-contain sm:h-[70px] sm:w-[70px]"
          />
          <div className="absolute inset-0 flex items-center justify-center font-rubik text-xl sm:text-2xl md:text-4xl">
            {props.children}
          </div>
        </div>
      ) : (
        <div className="font-rubik text-xl sm:text-2xl md:text-4xl">
          {props.children}
        </div>
      )}
    </MotionLink>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    aria-disabled={disabled}
    size="default"
    className={cn(
      'gap-1 pl-2.5',
      disabled && 'pointer-events-none opacity-50',
      className,
    )}
    {...props}
  >
    <Image
      src={'/icons/pagination-arrow-left.svg'}
      alt={''}
      width={24}
      height={24}
    />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    aria-disabled={disabled}
    size="default"
    className={cn(
      'gap-1 pr-2.5',
      disabled && 'pointer-events-none opacity-50',
      className,
    )}
    {...props}
  >
    <Image
      src={'/icons/pagination-arrow-right.svg'}
      alt={''}
      width={24}
      height={24}
    />
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
