'use client'

import { Slot } from '@radix-ui/react-slot'
import Link from 'next/link'
import { useLocale } from 'next-intl'

import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react'
import { cn } from '@/utils/cn'

const Breadcrumb = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<'nav'> & {
    separator?: ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)

Breadcrumb.displayName = 'Breadcrumb'

const BreadcrumbList = forwardRef<
  HTMLOListElement,
  ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-base break-words sm:gap-2.5',
      className,
    )}
    {...props}
  />
))

BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
))

BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
  }
>(({ asChild, className, href: originalHref, ...props }, ref) => {
  const locale = useLocale()
  const href = originalHref === '/' ? `/${locale}` : originalHref
  const classes = cn('hover:text-foreground transition-colors', className)

  if (asChild) {
    return <Slot ref={ref} className={classes} {...props} />
  }

  return (
    <Link
      href={href || `/${locale}`}
      ref={ref}
      className={classes}
      {...props}
    />
  )
})

BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('text-foreground font-normal', className)}
    {...props}
  />
))

BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    {...props}
  >
    {children ?? <div className="font-rubik">{'>'}</div>}
  </li>
)

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
