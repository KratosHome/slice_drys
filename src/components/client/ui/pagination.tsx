'use client'
import * as React from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ButtonProps, buttonVariants } from '@/components/admin/ui/button'
import Image from 'next/image'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
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
    className={cn('flex flex-row items-center gap-1', className)}
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
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  href, // Додаємо href
  onClick, // Додаємо onClick
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
    <motion.a
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        buttonVariants({
          variant: isActive ? 'none' : 'none',
        }),
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
            width={70}
            height={70}
            className="object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center font-rubik text-[48px]">
            {props.children}
          </div>
        </div>
      ) : (
        <div className="font-rubik text-[48px]">{props.children}</div>
      )}
    </motion.a>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <Image
      src={'/icons/pagination-arrow-left.svg'}
      alt={''}
      width={30}
      height={30}
    />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <Image
      src={'/icons/pagination-arrow-right.svg'}
      alt={''}
      width={30}
      height={30}
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
    <span className="sr-only">More pages</span>
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
