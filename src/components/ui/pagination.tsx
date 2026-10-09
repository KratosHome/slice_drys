'use client'

import Link, { type LinkProps } from 'next/link'
import { MoreHorizontalIcon } from '@/components/ui/native-icons'
import {
  type ButtonVariantProps,
  buttonVariants,
} from '@/components/ui/button-variants'

import { type ComponentProps, forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center px-2 sm:px-4', className)}
    {...props}
  />
)

Pagination.displayName = 'Pagination'

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        'flex flex-row flex-wrap items-center gap-2 text-base sm:gap-3 sm:text-lg',
        className,
      )}
      {...props}
    />
  ),
)

PaginationContent.displayName = 'PaginationContent'

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('cursor-pointer', className)} {...props} />
  ),
)

PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
  label?: string
} & Pick<ButtonVariantProps, 'size'> &
  ComponentProps<'a'> &
  LinkProps

const PaginationLink = ({
  className,
  isActive,
  href,
  onClick,
  label,
  prefetch = false,
  disabled,
  size,
  ...props
}: PaginationLinkProps) => {
  const isDisabled =
    disabled ||
    props['aria-disabled'] === true ||
    props['aria-disabled'] === 'true'
  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: 'none', size }),
        'pagination-link',
        'font-rubik relative flex h-[50px] w-[50px] items-center justify-center sm:h-[70px] sm:w-[70px]',
        className,
      )}
      href={href}
      prefetch={prefetch}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      tabIndex={isDisabled ? -1 : props.tabIndex}
      aria-disabled={isDisabled || undefined}
      aria-label={label ?? props['aria-label']}
      aria-current={isActive ? 'page' : undefined}
    >
      {props.children}

      {isActive ? (
        <svg
          role="img"
          aria-label={'active page'}
          className="absolute h-[50px] w-[50px] origin-center sm:h-[70px] sm:w-[70px]"
        >
          <use href="/icons/selection-sprite.svg#o" />
        </svg>
      ) : null}
    </Link>
  )
}

PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  disabled,
  label,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    label={label}
    disabled={disabled}
    aria-disabled={disabled}
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
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    label={label}
    disabled={disabled}
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
}: ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontalIcon className="h-4 w-4" />
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
