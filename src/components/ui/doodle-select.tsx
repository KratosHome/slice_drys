'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/utils/cn'

import { CheckIcon, ChevronUpIcon } from '@radix-ui/react-icons'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs focus:ring-1 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      'bg-light_gray flex w-fit gap-4 rounded-sm px-3 py-2 text-2xl font-bold',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUpIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

const ChevronDownIcon = () => (
  <svg
    width="29"
    height="23"
    viewBox="0 0 29 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28.72 4.11828C28.72 4.19828 28.7067 4.25161 28.68 4.27828C28.68 4.27828 28.7333 4.21161 28.84 4.07828C28.8133 4.15828 28.7867 4.23828 28.76 4.31828C28.7333 4.42495 28.6933 4.51828 28.64 4.59828C28.5333 4.83828 28.3867 5.06495 28.2 5.27828C28.04 5.51828 27.88 5.75828 27.72 5.99828C27.5067 6.34495 27.2933 6.69161 27.08 7.03828C26.8667 7.38495 26.6533 7.73161 26.44 8.07828C26.44 8.07828 26.4267 8.07828 26.4 8.07828C26.4 8.10495 26.4 8.13161 26.4 8.15828C26.3733 8.15828 26.36 8.15828 26.36 8.15828C26.36 8.18495 26.3467 8.19828 26.32 8.19828C25.8133 8.75828 25.4 9.39828 25.08 10.1183C24.7867 10.8383 24.4933 11.5716 24.2 12.3183C23.9067 13.0649 23.48 13.7049 22.92 14.2383C22.36 14.9316 21.84 15.6649 21.36 16.4383C20.88 17.2116 20.3333 17.9316 19.72 18.5983C19.4533 18.9716 19.1733 19.3716 18.88 19.7983C18.6133 20.2249 18.3333 20.6249 18.04 20.9983C17.9333 21.1583 17.8133 21.3316 17.68 21.5183C17.5733 21.7049 17.4133 21.8516 17.2 21.9583C17.0133 22.0916 16.8133 22.1716 16.6 22.1983C16.3867 22.2516 16.1733 22.2916 15.96 22.3183C15.88 22.3449 15.8 22.3449 15.72 22.3183C15.64 22.3183 15.56 22.3183 15.48 22.3183C15.4533 22.3183 15.4267 22.3049 15.4 22.2783C15.3733 22.2783 15.3333 22.2783 15.28 22.2783C14.8533 22.2516 14.44 22.2249 14.04 22.1983C13.64 22.1716 13.2667 22.0249 12.92 21.7583C12.6533 21.5716 12.4267 21.3183 12.24 20.9983C12.08 20.6783 11.9333 20.3716 11.8 20.0783C11.6133 19.7583 11.4267 19.4516 11.24 19.1583C11.08 18.8649 10.8933 18.5716 10.68 18.2783C10.1467 17.6116 9.66667 16.8916 9.24 16.1183C8.81333 15.3449 8.30667 14.6383 7.72 13.9983C7 13.2783 6.36 12.4649 5.8 11.5583C5.26667 10.6783 4.64 9.87828 3.92 9.15828C3.92 9.15828 3.90667 9.15828 3.88 9.15828C3.88 9.15828 3.88 9.14495 3.88 9.11828L3.84 9.07828C3.52 8.65161 3.2 8.19828 2.88 7.71828C2.56 7.26495 2.25333 6.81161 1.96 6.35828C1.74667 6.03828 1.53333 5.70495 1.32 5.35828C1.10667 5.03828 0.933333 4.69161 0.8 4.31828C0.693333 4.10495 0.746667 3.89161 0.96 3.67828C1.01333 3.65161 1.05333 3.62495 1.08 3.59828C1.10667 3.59828 1.13333 3.58495 1.16 3.55828L0.88 2.99828L0.64 2.43828L0.36 1.83828C0.28 1.75828 0.306667 1.67828 0.44 1.59828C0.493333 1.54495 0.56 1.55828 0.64 1.63828L0.64 1.55828C0.613333 1.45161 0.653333 1.37161 0.76 1.31828C0.866667 1.31828 0.933333 1.35828 0.96 1.43828L1.16 2.15828L1.36 2.83828L1.52 3.35828C1.68 3.14495 1.86667 2.97161 2.08 2.83828L1.8 2.11828L1.32 0.91828C1.24 0.83828 1.26667 0.75828 1.4 0.67828C1.50667 0.624946 1.58667 0.651613 1.64 0.75828L1.92 1.35828L2.12 1.99828L2.4 2.71828C2.53333 2.69161 2.65333 2.69161 2.76 2.71828L2.48 2.07828L2.28 1.43828L2.12 0.83828C2.09333 0.731613 2.13333 0.651613 2.24 0.59828C2.34667 0.59828 2.41333 0.63828 2.44 0.71828L2.64 1.35828L2.8 1.95828L3.16 2.75828L3.48 2.75828L3.2 2.11828L3 1.43828L2.8 0.87828C2.77333 0.771613 2.8 0.691613 2.88 0.63828C2.98667 0.584946 3.06667 0.624946 3.12 0.75828L3.36 1.31828L3.36 1.35828L3.52 1.99828L3.88 2.75828L3.96 2.75828C4.09333 2.75828 4.2 2.74495 4.28 2.71828L3.64 1.43828L3.64 1.39828L3.48 0.79828C3.45333 0.691613 3.49333 0.611613 3.6 0.55828C3.70667 0.55828 3.77333 0.59828 3.8 0.67828L4 1.27828L4.28 1.91828L4.6 2.55828C4.6 2.55828 4.6 2.57161 4.6 2.59828C4.6 2.62495 4.61333 2.67828 4.64 2.75828L4.96 2.75828L4.72 2.23828L4.52 1.51828L4.28 0.83828C4.25333 0.731613 4.28 0.651613 4.36 0.59828C4.46667 0.544946 4.54667 0.584946 4.6 0.71828L4.88 1.39828L4.88 1.43828L5.04 2.11828L5.32 2.67828L5.32 2.71828L5.6 2.71828L5.4 2.03828L5.12 1.39828L4.92 0.75828C4.89333 0.651613 4.92 0.571613 5 0.51828C5.10667 0.464946 5.18667 0.504946 5.24 0.63828L5.48 1.23828L5.72 1.91828L6 2.71828L6.28 2.71828L6.04 2.11828L5.72 1.47828L5.48 0.75828C5.45333 0.651613 5.48 0.571613 5.56 0.51828C5.66667 0.464946 5.74667 0.504946 5.8 0.63828L6.36 1.99828L6.68 2.67828L7.16 2.67828L7 2.07828L6.72 1.47828L6.72 1.43828L6.56 0.75828C6.53333 0.651613 6.57333 0.571613 6.68 0.51828C6.78667 0.51828 6.85333 0.55828 6.88 0.63828L7.08 1.35828L7.32 1.95828L7.56 2.67828L7.76 2.67828L7.52 2.15828L7.32 1.47828L7.16 0.91828C7.13333 0.811613 7.16 0.731613 7.24 0.67828C7.37333 0.67828 7.45333 0.71828 7.48 0.79828L7.68 1.39828L7.84 2.03828L8.12 2.63828L8.48 2.63828L8.24 2.11828L7.92 1.47828L7.68 0.75828C7.65333 0.651613 7.68 0.571613 7.76 0.51828C7.86667 0.464947 7.94667 0.504947 8 0.63828L8.28 1.31828L8.56 1.95828L8.88 2.59828L8.88 2.63828C8.98667 2.63828 9.08 2.63828 9.16 2.63828C9.26667 2.66495 9.37333 2.69161 9.48 2.71828L9.36 2.47828L9.36 2.43828L9.2 1.79828L9 1.19828C8.97333 1.17161 8.97333 1.13161 9 1.07828C9.05333 1.02495 9.09333 0.99828 9.12 0.99828C9.22667 0.944947 9.30667 0.984947 9.36 1.11828L9.52 1.67828L9.64 2.11828L9.76 1.99828C9.86667 1.94495 9.94667 1.98495 10 2.11828L10.24 2.67828L10.36 3.07828C10.4133 3.07828 10.44 3.09161 10.44 3.11828C10.4667 3.11828 10.48 3.11828 10.48 3.11828C10.5067 3.14495 10.52 3.15828 10.52 3.15828C10.7067 3.29161 10.8533 3.45161 10.96 3.63828C11.0933 3.82495 11.2133 3.99828 11.32 4.15828C11.56 4.47828 11.7867 4.79828 12 5.11828C12.2133 5.43828 12.4267 5.77161 12.64 6.11828C12.6933 6.11828 12.7333 6.18495 12.76 6.31828C12.8133 6.42495 12.8667 6.51828 12.92 6.59828C12.9733 6.70495 13.0267 6.79828 13.08 6.87828C13.16 6.90495 13.2133 7.01161 13.24 7.19828C13.5333 7.73161 13.8267 8.26495 14.12 8.79828C14.4133 9.35828 14.7333 9.89161 15.08 10.3983C15.1067 10.4249 15.12 10.4383 15.12 10.4383L14.88 9.75828L14.56 9.15828L14.28 8.43828C14.2 8.35828 14.2267 8.27828 14.36 8.19828C14.4667 8.14495 14.5467 8.18495 14.6 8.31828L14.88 8.99828L15.2 9.59828L15.2 9.63828L15.48 10.2783L15.48 10.3183L15.52 10.4383L15.64 10.1983L15.48 9.75828L15.24 9.15828L14.96 8.47828L14.96 8.43828L14.76 7.79828C14.76 7.69161 14.8 7.61161 14.88 7.55828C15.0133 7.55828 15.0933 7.61161 15.12 7.71828L15.32 8.35828L15.56 9.03828L15.84 9.59828C15.84 9.62495 15.8533 9.69161 15.88 9.79828C15.9067 9.77161 15.9333 9.73161 15.96 9.67828C15.9867 9.62495 16.0133 9.57161 16.04 9.51828L15.88 9.11828L15.48 7.83828L15.28 7.15828C15.2267 7.02495 15.2667 6.95828 15.4 6.95828C15.5333 6.93161 15.6133 6.97161 15.64 7.07828L15.84 7.71828L16 8.35828L16.28 9.11828C16.3067 9.09161 16.3333 9.05161 16.36 8.99828C16.3867 8.94495 16.4133 8.89161 16.44 8.83828L16.32 8.51828L16.12 7.95828L15.8 7.27828L15.6 6.59828C15.5467 6.46495 15.5867 6.39828 15.72 6.39828C15.8267 6.34495 15.9067 6.38495 15.96 6.51828L16.12 7.15828L16.44 7.79828L16.68 8.39828C16.7067 8.37161 16.7467 8.30495 16.8 8.19828L16.68 7.83828L16.48 7.11828L16.24 6.51828L16 5.83828C15.9733 5.81161 15.9733 5.77161 16 5.71828C16.0533 5.66495 16.0933 5.63828 16.12 5.63828C16.2267 5.58495 16.3067 5.61161 16.36 5.71828L16.56 6.39828L16.84 6.99828L16.84 7.03828L17.04 7.79828C17.0933 7.69161 17.1467 7.61161 17.2 7.55828L17.04 7.19828L16.8 6.63828L16.6 5.95828L16.32 5.27828C16.2933 5.17161 16.3333 5.09161 16.44 5.03828C16.52 4.98495 16.5867 5.01161 16.64 5.11828L16.92 5.83828L17.16 6.47828L17.4 7.15828C17.4533 7.13161 17.4933 7.07828 17.52 6.99828C17.5467 6.94495 17.5733 6.89161 17.6 6.83828L17.52 6.55828L17.24 5.87828L16.96 5.23828L16.72 4.55828C16.6933 4.45161 16.7333 4.37161 16.84 4.31828C16.9467 4.26495 17.0267 4.30495 17.08 4.43828L17.28 5.11828L17.56 5.71828L17.6 5.71828L17.84 6.43828C17.8933 6.33161 17.9467 6.25161 18 6.19828L17.92 5.95828L17.68 5.35828L17.68 5.31828L17.48 4.63828L17.24 4.03828C17.2133 3.93161 17.24 3.85161 17.32 3.79828C17.4267 3.74495 17.5067 3.77161 17.56 3.87828L17.84 4.51828L17.84 4.55828L18.04 5.23828L18.24 5.75828L18.36 5.51828L18.32 5.23828L18 4.67828L17.76 4.11828L17.72 4.07828L17.56 3.43828C17.5333 3.33161 17.5733 3.25161 17.68 3.19828C17.8133 3.14495 17.88 3.18495 17.88 3.31828L18.08 3.95828L18.32 4.51828L18.6 5.07828C18.6267 5.02495 18.6667 4.97161 18.72 4.91828L18.6 4.63828L18.6 4.59828L18.4 3.99828L18.16 3.31828L17.92 2.71828C17.8933 2.61161 17.92 2.53161 18 2.47828C18.1067 2.42495 18.1867 2.46495 18.24 2.59828L18.52 3.19828L18.76 3.87828L18.92 4.47828C19 4.39828 19.0533 4.25161 19.08 4.03828L18.8 3.39828L18.48 2.83828L18.48 2.79828L18.28 2.11828C18.2533 2.01161 18.28 1.93161 18.36 1.87828C18.4933 1.87828 18.5733 1.91828 18.6 1.99828L18.84 2.67828L19.12 3.23828L19.12 3.27828L19.36 3.83828L19.68 3.51828C19.7333 3.46495 19.7867 3.42495 19.84 3.39828L19.4 2.51828C19.4 2.51828 19.4 2.50495 19.4 2.47828C19.4 2.47828 19.3867 2.47828 19.36 2.47828L19.2 1.79828L18.88 1.15828C18.8267 1.05161 18.8533 0.971614 18.96 0.91828C19.0667 0.864947 19.1467 0.904947 19.2 1.03828L19.52 1.63828L19.52 1.67828L19.72 2.35828L20.16 3.23828C20.2933 3.18495 20.4133 3.13161 20.52 3.07828C20.6267 3.02495 20.7333 2.93161 20.84 2.79828L20.68 2.23828L20.4 1.59828L20.4 1.55828L20.24 0.95828C20.2133 0.851614 20.2533 0.771614 20.36 0.71828C20.4667 0.71828 20.5333 0.75828 20.56 0.83828L20.76 1.47828L21 2.11828L21.2 2.71828L21.28 2.91828C21.4133 2.91828 21.5067 2.86495 21.56 2.75828L21.28 2.07828L21.08 1.39828L20.84 0.71828C20.8133 0.611614 20.84 0.531614 20.92 0.47828C21.0267 0.424947 21.1067 0.464947 21.16 0.59828L21.44 1.27828L21.44 1.31828L21.6 1.95828L21.88 2.63828L21.96 2.83828C22.04 2.83828 22.12 2.79828 22.2 2.71828C22.2 2.69161 22.1867 2.67828 22.16 2.67828L22 2.03828L21.68 1.39828L21.4 0.79828C21.32 0.71828 21.3467 0.63828 21.48 0.55828C21.56 0.531614 21.64 0.55828 21.72 0.63828L22.04 1.23828L22.32 1.87828L22.32 1.91828L22.6 2.75828C22.6533 2.73161 22.72 2.71828 22.8 2.71828C22.88 2.71828 22.96 2.70495 23.04 2.67828L22.72 1.99828L22.48 1.35828L22.28 0.718281C22.2533 0.611614 22.28 0.531614 22.36 0.47828C22.4933 0.47828 22.5733 0.51828 22.6 0.598281L22.84 1.23828L23.04 1.87828L23.36 2.55828L23.36 2.59828L23.4 2.67828C23.4533 2.65161 23.56 2.63828 23.72 2.63828L23.52 2.07828L23.2 1.47828L22.96 0.838281C22.9067 0.731614 22.9333 0.651614 23.04 0.598281C23.1467 0.544947 23.2267 0.584947 23.28 0.718281L23.84 1.91828L23.84 1.95828L24.08 2.55828L24.08 2.59828L24.28 2.59828L24.12 2.19828L23.92 1.51828L23.72 0.918281C23.6933 0.811614 23.72 0.731614 23.8 0.678281C23.9067 0.624947 23.9867 0.664947 24.04 0.798281L24.28 1.39828L24.28 1.43828L24.44 2.07828L24.64 2.55828C24.72 2.55828 24.7867 2.54495 24.84 2.51828C24.92 2.51828 24.9867 2.51828 25.04 2.51828L24.8 1.99828L24.48 1.39828L24.48 1.35828L24.28 0.678281C24.2533 0.571614 24.28 0.491614 24.36 0.438281C24.4933 0.438281 24.5733 0.478281 24.6 0.558281L24.84 1.23828L25.4 2.51828C25.4533 2.51828 25.5067 2.50495 25.56 2.47828C25.64 2.47828 25.72 2.47828 25.8 2.47828L25.64 2.11828L25.36 1.43828L25.08 0.838281C25 0.758281 25.0267 0.678281 25.16 0.598281C25.24 0.571614 25.32 0.598281 25.4 0.678281L25.68 1.27828L25.72 1.27828L25.96 1.99828L26.16 2.47828L26.48 2.47828L26.36 2.07828L26.12 1.51828L25.88 0.838281C25.8533 0.731614 25.88 0.651614 25.96 0.598281C26.0667 0.544947 26.1467 0.584947 26.2 0.718281L26.48 1.35828L26.84 2.43828L26.92 2.43828C26.9733 2.41161 27.04 2.39828 27.12 2.39828L26.84 1.55828L26.68 0.998281C26.6533 0.891614 26.68 0.811614 26.76 0.758281C26.8933 0.758281 26.9733 0.798281 27 0.878281L27.36 2.03828L27.48 2.43828C27.5333 2.43828 27.56 2.42495 27.56 2.39828L27.56 2.35828L27.36 1.67828C27.3333 1.57161 27.36 1.49161 27.44 1.43828C27.5733 1.43828 27.6667 1.51828 27.72 1.67828L28 2.23828L28.28 3.03828L28.64 3.39828C28.5333 3.34495 28.44 3.30495 28.36 3.27828L28.48 3.51828L28.72 4.11828ZM1.96 4.55828L1.96 4.59828C2.09333 4.81161 2.22667 5.02495 2.36 5.23828C2.52 5.45161 2.65333 5.65161 2.76 5.83828C3.05333 6.29161 3.34667 6.74495 3.64 7.19828C3.96 7.65161 4.28 8.09161 4.6 8.51828C5.32 9.23828 5.94667 10.0383 6.48 10.9183C7.04 11.7983 7.69333 12.5983 8.44 13.3183L8.44 13.3583C9.05333 14.0249 9.57333 14.7449 10 15.5183C10.4267 16.2916 10.92 17.0116 11.48 17.6783L11.48 17.7183C11.6933 18.0116 11.8933 18.3183 12.08 18.6383C12.2667 18.9583 12.4533 19.2783 12.64 19.5983C12.7733 19.8116 12.8933 20.0516 13 20.3183C13.1333 20.6116 13.2933 20.8383 13.48 20.9983C13.6933 21.1316 13.92 21.2116 14.16 21.2383C14.4267 21.2916 14.6933 21.3183 14.96 21.3183L15.32 21.3183C15.3733 21.3183 15.4133 21.3183 15.44 21.3183C15.4667 21.3449 15.4933 21.3583 15.52 21.3583C15.5733 21.3583 15.6267 21.3583 15.68 21.3583C15.7333 21.3849 15.7867 21.3849 15.84 21.3583C15.9733 21.3316 16.12 21.3049 16.28 21.2783C16.44 21.2783 16.5733 21.2249 16.68 21.1183C16.8133 21.0383 16.92 20.9316 17 20.7983C17.1067 20.6649 17.2 20.5316 17.28 20.3983C17.6 20.0249 17.8933 19.6249 18.16 19.1983C18.4267 18.7983 18.6933 18.3983 18.96 17.9983C18.96 17.9716 18.96 17.9583 18.96 17.9583C18.9867 17.9583 19 17.9583 19 17.9583C19.6133 17.2916 20.16 16.5716 20.64 15.7983C21.12 15.0249 21.64 14.2916 22.2 13.5983L22.24 13.5983C22.7733 13.0649 23.1867 12.4249 23.48 11.6783C23.7733 10.9583 24.0667 10.2249 24.36 9.47828C24.68 8.75828 25.0933 8.11828 25.6 7.55828C25.8133 7.21161 26.0267 6.86495 26.24 6.51828C26.48 6.17161 26.7067 5.81161 26.92 5.43828C27.0533 5.25161 27.1867 5.06495 27.32 4.87828C27.48 4.71828 27.6133 4.53161 27.72 4.31828C27.88 4.53161 28.1467 4.54495 28.52 4.35828C28.44 4.35828 28.3867 4.30495 28.36 4.19828C28.28 4.30495 28.16 4.27828 28 4.11828C27.9467 4.06495 27.9067 4.01161 27.88 3.95828C27.88 3.87828 27.8933 3.81161 27.92 3.75828C27.9733 3.65161 28.0267 3.59828 28.08 3.59828L27.92 3.31828C27.92 3.31828 27.9067 3.31828 27.88 3.31828C27.88 3.31828 27.88 3.33161 27.88 3.35828C27.88 3.43828 27.84 3.47828 27.76 3.47828C27.76 3.50495 27.7333 3.51828 27.68 3.51828C27.6533 3.54495 27.64 3.57161 27.64 3.59828C27.64 3.62495 27.6267 3.65161 27.6 3.67828C27.44 3.51828 27.32 3.41161 27.24 3.35828L27.16 3.35828C27.16 3.43828 27.12 3.49161 27.04 3.51828C26.9067 3.51828 26.8267 3.47828 26.8 3.39828L26.64 3.39828C26.5867 3.42495 26.52 3.43828 26.44 3.43828C26.3867 3.49161 26.3467 3.51828 26.32 3.51828C26.2133 3.51828 26.1467 3.49161 26.12 3.43828L25.68 3.43828L25.6 3.51828C25.52 3.51828 25.4533 3.50495 25.4 3.47828C25.32 3.47828 25.2267 3.47828 25.12 3.47828C25.04 3.47828 24.96 3.49161 24.88 3.51828L24.76 3.51828C24.28 3.54495 23.7867 3.58495 23.28 3.63828C22.8 3.69161 22.32 3.75828 21.84 3.83828C21.5733 3.86495 21.2933 3.89161 21 3.91828C20.7333 3.97161 20.4933 4.09161 20.28 4.27828C20.0667 4.46495 19.88 4.70495 19.72 4.99828C19.56 5.31828 19.4133 5.59828 19.28 5.83828C19.04 6.29161 18.7867 6.73161 18.52 7.15828C18.28 7.58495 18.0267 8.01161 17.76 8.43828C17.4667 8.94495 17.1733 9.45161 16.88 9.95828C16.6133 10.4649 16.3333 10.9716 16.04 11.4783C15.9333 11.6383 15.8667 11.8116 15.84 11.9983C15.8133 12.1849 15.6667 12.2783 15.4 12.2783C15.2133 12.3049 15.08 12.2649 15 12.1583C14.9467 12.0783 14.8933 11.9716 14.84 11.8383C14.8133 11.7583 14.7733 11.6649 14.72 11.5583C14.64 11.4516 14.56 11.3449 14.48 11.2383C14.4267 11.1316 14.36 11.0249 14.28 10.9183C13.9333 10.3583 13.6 9.78495 13.28 9.19828C12.96 8.61161 12.6267 8.02495 12.28 7.43828C12.28 7.41161 12.2667 7.38495 12.24 7.35828C12.24 7.35828 12.24 7.34495 12.24 7.31828C12.2133 7.31828 12.1733 7.29161 12.12 7.23828L11.92 6.75828C11.8933 6.75828 11.88 6.74495 11.88 6.71828C11.8 6.66495 11.7467 6.62495 11.72 6.59828L11.48 6.07828C11.4267 6.07828 11.3733 6.03828 11.32 5.95828L11.2 5.67828C11.1733 5.65161 11.1467 5.61161 11.12 5.55828C11.0933 5.53161 11.0667 5.49161 11.04 5.43828C10.9867 5.38495 10.92 5.29161 10.84 5.15828C10.8133 5.10495 10.7733 5.03828 10.72 4.95828C10.6667 4.87828 10.6133 4.81161 10.56 4.75828C10.4533 4.62495 10.3467 4.47828 10.24 4.31828C10.16 4.15828 10.0533 4.02495 9.92 3.91828C9.68 3.75828 9.44 3.66495 9.2 3.63828C8.98667 3.61161 8.74667 3.59828 8.48 3.59828L8.32 3.59828C8.05333 3.59828 7.77333 3.59828 7.48 3.59828C7.18667 3.62495 6.89333 3.63828 6.6 3.63828C6.17333 3.66495 5.73333 3.67828 5.28 3.67828C4.85333 3.70495 4.41333 3.71828 3.96 3.71828L3.2 3.71828C3.17333 3.71828 3.14667 3.70495 3.12 3.67828C3.09333 3.67828 3.05333 3.67828 3 3.67828C2.81333 3.62495 2.68 3.62495 2.6 3.67828C2.36 3.78495 2.14667 4.07828 1.96 4.55828ZM27.72 4.31828C27.5867 4.18495 27.5467 3.97161 27.6 3.67828C27.68 3.78495 27.7733 3.87828 27.88 3.95828C27.8533 4.01161 27.84 4.05161 27.84 4.07828C27.84 4.10495 27.8267 4.13161 27.8 4.15828C27.8 4.15828 27.7733 4.21161 27.72 4.31828Z"
      fill="#0F0F0F"
    />
    <path
      d="M28.72 4.11828C28.72 4.19828 28.7067 4.25161 28.68 4.27828C28.68 4.27828 28.7333 4.21161 28.84 4.07828C28.8133 4.15828 28.7867 4.23828 28.76 4.31828C28.7333 4.42495 28.6933 4.51828 28.64 4.59828C28.5333 4.83828 28.3867 5.06495 28.2 5.27828C28.04 5.51828 27.88 5.75828 27.72 5.99828C27.5067 6.34495 27.2933 6.69161 27.08 7.03828C26.8667 7.38495 26.6533 7.73161 26.44 8.07828C26.44 8.07828 26.4267 8.07828 26.4 8.07828C26.4 8.10495 26.4 8.13161 26.4 8.15828C26.3733 8.15828 26.36 8.15828 26.36 8.15828C26.36 8.18495 26.3467 8.19828 26.32 8.19828C25.8133 8.75828 25.4 9.39828 25.08 10.1183C24.7867 10.8383 24.4933 11.5716 24.2 12.3183C23.9067 13.0649 23.48 13.7049 22.92 14.2383C22.36 14.9316 21.84 15.6649 21.36 16.4383C20.88 17.2116 20.3333 17.9316 19.72 18.5983C19.4533 18.9716 19.1733 19.3716 18.88 19.7983C18.6133 20.2249 18.3333 20.6249 18.04 20.9983C17.9333 21.1583 17.8133 21.3316 17.68 21.5183C17.5733 21.7049 17.4133 21.8516 17.2 21.9583C17.0133 22.0916 16.8133 22.1716 16.6 22.1983C16.3867 22.2516 16.1733 22.2916 15.96 22.3183C15.88 22.3449 15.8 22.3449 15.72 22.3183C15.64 22.3183 15.56 22.3183 15.48 22.3183C15.4533 22.3183 15.4267 22.3049 15.4 22.2783C15.3733 22.2783 15.3333 22.2783 15.28 22.2783C14.8533 22.2516 14.44 22.2249 14.04 22.1983C13.64 22.1716 13.2667 22.0249 12.92 21.7583C12.6533 21.5716 12.4267 21.3183 12.24 20.9983C12.08 20.6783 11.9333 20.3716 11.8 20.0783C11.6133 19.7583 11.4267 19.4516 11.24 19.1583C11.08 18.8649 10.8933 18.5716 10.68 18.2783C10.1467 17.6116 9.66667 16.8916 9.24 16.1183C8.81333 15.3449 8.30667 14.6383 7.72 13.9983C7 13.2783 6.36 12.4649 5.8 11.5583C5.26667 10.6783 4.64 9.87828 3.92 9.15828C3.92 9.15828 3.90667 9.15828 3.88 9.15828C3.88 9.15828 3.88 9.14495 3.88 9.11828L3.84 9.07828C3.52 8.65161 3.2 8.19828 2.88 7.71828C2.56 7.26495 2.25333 6.81161 1.96 6.35828C1.74667 6.03828 1.53333 5.70495 1.32 5.35828C1.10667 5.03828 0.933333 4.69161 0.8 4.31828C0.693333 4.10495 0.746667 3.89161 0.96 3.67828C1.01333 3.65161 1.05333 3.62495 1.08 3.59828C1.10667 3.59828 1.13333 3.58495 1.16 3.55828L0.88 2.99828L0.64 2.43828L0.36 1.83828C0.28 1.75828 0.306667 1.67828 0.44 1.59828C0.493333 1.54495 0.56 1.55828 0.64 1.63828L0.64 1.55828C0.613333 1.45161 0.653333 1.37161 0.76 1.31828C0.866667 1.31828 0.933333 1.35828 0.96 1.43828L1.16 2.15828L1.36 2.83828L1.52 3.35828C1.68 3.14495 1.86667 2.97161 2.08 2.83828L1.8 2.11828L1.32 0.91828C1.24 0.83828 1.26667 0.75828 1.4 0.67828C1.50667 0.624946 1.58667 0.651613 1.64 0.75828L1.92 1.35828L2.12 1.99828L2.4 2.71828C2.53333 2.69161 2.65333 2.69161 2.76 2.71828L2.48 2.07828L2.28 1.43828L2.12 0.83828C2.09333 0.731613 2.13333 0.651613 2.24 0.59828C2.34667 0.59828 2.41333 0.63828 2.44 0.71828L2.64 1.35828L2.8 1.95828L3.16 2.75828L3.48 2.75828L3.2 2.11828L3 1.43828L2.8 0.87828C2.77333 0.771613 2.8 0.691613 2.88 0.63828C2.98667 0.584946 3.06667 0.624946 3.12 0.75828L3.36 1.31828L3.36 1.35828L3.52 1.99828L3.88 2.75828L3.96 2.75828C4.09333 2.75828 4.2 2.74495 4.28 2.71828L3.64 1.43828L3.64 1.39828L3.48 0.79828C3.45333 0.691613 3.49333 0.611613 3.6 0.55828C3.70667 0.55828 3.77333 0.59828 3.8 0.67828L4 1.27828L4.28 1.91828L4.6 2.55828C4.6 2.55828 4.6 2.57161 4.6 2.59828C4.6 2.62495 4.61333 2.67828 4.64 2.75828L4.96 2.75828L4.72 2.23828L4.52 1.51828L4.28 0.83828C4.25333 0.731613 4.28 0.651613 4.36 0.59828C4.46667 0.544946 4.54667 0.584946 4.6 0.71828L4.88 1.39828L4.88 1.43828L5.04 2.11828L5.32 2.67828L5.32 2.71828L5.6 2.71828L5.4 2.03828L5.12 1.39828L4.92 0.75828C4.89333 0.651613 4.92 0.571613 5 0.51828C5.10667 0.464946 5.18667 0.504946 5.24 0.63828L5.48 1.23828L5.72 1.91828L6 2.71828L6.28 2.71828L6.04 2.11828L5.72 1.47828L5.48 0.75828C5.45333 0.651613 5.48 0.571613 5.56 0.51828C5.66667 0.464946 5.74667 0.504946 5.8 0.63828L6.36 1.99828L6.68 2.67828L7.16 2.67828L7 2.07828L6.72 1.47828L6.72 1.43828L6.56 0.75828C6.53333 0.651613 6.57333 0.571613 6.68 0.51828C6.78667 0.51828 6.85333 0.55828 6.88 0.63828L7.08 1.35828L7.32 1.95828L7.56 2.67828L7.76 2.67828L7.52 2.15828L7.32 1.47828L7.16 0.91828C7.13333 0.811613 7.16 0.731613 7.24 0.67828C7.37333 0.67828 7.45333 0.71828 7.48 0.79828L7.68 1.39828L7.84 2.03828L8.12 2.63828L8.48 2.63828L8.24 2.11828L7.92 1.47828L7.68 0.75828C7.65333 0.651613 7.68 0.571613 7.76 0.51828C7.86667 0.464947 7.94667 0.504947 8 0.63828L8.28 1.31828L8.56 1.95828L8.88 2.59828L8.88 2.63828C8.98667 2.63828 9.08 2.63828 9.16 2.63828C9.26667 2.66495 9.37333 2.69161 9.48 2.71828L9.36 2.47828L9.36 2.43828L9.2 1.79828L9 1.19828C8.97333 1.17161 8.97333 1.13161 9 1.07828C9.05333 1.02495 9.09333 0.99828 9.12 0.99828C9.22667 0.944947 9.30667 0.984947 9.36 1.11828L9.52 1.67828L9.64 2.11828L9.76 1.99828C9.86667 1.94495 9.94667 1.98495 10 2.11828L10.24 2.67828L10.36 3.07828C10.4133 3.07828 10.44 3.09161 10.44 3.11828C10.4667 3.11828 10.48 3.11828 10.48 3.11828C10.5067 3.14495 10.52 3.15828 10.52 3.15828C10.7067 3.29161 10.8533 3.45161 10.96 3.63828C11.0933 3.82495 11.2133 3.99828 11.32 4.15828C11.56 4.47828 11.7867 4.79828 12 5.11828C12.2133 5.43828 12.4267 5.77161 12.64 6.11828C12.6933 6.11828 12.7333 6.18495 12.76 6.31828C12.8133 6.42495 12.8667 6.51828 12.92 6.59828C12.9733 6.70495 13.0267 6.79828 13.08 6.87828C13.16 6.90495 13.2133 7.01161 13.24 7.19828C13.5333 7.73161 13.8267 8.26495 14.12 8.79828C14.4133 9.35828 14.7333 9.89161 15.08 10.3983C15.1067 10.4249 15.12 10.4383 15.12 10.4383L14.88 9.75828L14.56 9.15828L14.28 8.43828C14.2 8.35828 14.2267 8.27828 14.36 8.19828C14.4667 8.14495 14.5467 8.18495 14.6 8.31828L14.88 8.99828L15.2 9.59828L15.2 9.63828L15.48 10.2783L15.48 10.3183L15.52 10.4383L15.64 10.1983L15.48 9.75828L15.24 9.15828L14.96 8.47828L14.96 8.43828L14.76 7.79828C14.76 7.69161 14.8 7.61161 14.88 7.55828C15.0133 7.55828 15.0933 7.61161 15.12 7.71828L15.32 8.35828L15.56 9.03828L15.84 9.59828C15.84 9.62495 15.8533 9.69161 15.88 9.79828C15.9067 9.77161 15.9333 9.73161 15.96 9.67828C15.9867 9.62495 16.0133 9.57161 16.04 9.51828L15.88 9.11828L15.48 7.83828L15.28 7.15828C15.2267 7.02495 15.2667 6.95828 15.4 6.95828C15.5333 6.93161 15.6133 6.97161 15.64 7.07828L15.84 7.71828L16 8.35828L16.28 9.11828C16.3067 9.09161 16.3333 9.05161 16.36 8.99828C16.3867 8.94495 16.4133 8.89161 16.44 8.83828L16.32 8.51828L16.12 7.95828L15.8 7.27828L15.6 6.59828C15.5467 6.46495 15.5867 6.39828 15.72 6.39828C15.8267 6.34495 15.9067 6.38495 15.96 6.51828L16.12 7.15828L16.44 7.79828L16.68 8.39828C16.7067 8.37161 16.7467 8.30495 16.8 8.19828L16.68 7.83828L16.48 7.11828L16.24 6.51828L16 5.83828C15.9733 5.81161 15.9733 5.77161 16 5.71828C16.0533 5.66495 16.0933 5.63828 16.12 5.63828C16.2267 5.58495 16.3067 5.61161 16.36 5.71828L16.56 6.39828L16.84 6.99828L16.84 7.03828L17.04 7.79828C17.0933 7.69161 17.1467 7.61161 17.2 7.55828L17.04 7.19828L16.8 6.63828L16.6 5.95828L16.32 5.27828C16.2933 5.17161 16.3333 5.09161 16.44 5.03828C16.52 4.98495 16.5867 5.01161 16.64 5.11828L16.92 5.83828L17.16 6.47828L17.4 7.15828C17.4533 7.13161 17.4933 7.07828 17.52 6.99828C17.5467 6.94495 17.5733 6.89161 17.6 6.83828L17.52 6.55828L17.24 5.87828L16.96 5.23828L16.72 4.55828C16.6933 4.45161 16.7333 4.37161 16.84 4.31828C16.9467 4.26495 17.0267 4.30495 17.08 4.43828L17.28 5.11828L17.56 5.71828L17.6 5.71828L17.84 6.43828C17.8933 6.33161 17.9467 6.25161 18 6.19828L17.92 5.95828L17.68 5.35828L17.68 5.31828L17.48 4.63828L17.24 4.03828C17.2133 3.93161 17.24 3.85161 17.32 3.79828C17.4267 3.74495 17.5067 3.77161 17.56 3.87828L17.84 4.51828L17.84 4.55828L18.04 5.23828L18.24 5.75828L18.36 5.51828L18.32 5.23828L18 4.67828L17.76 4.11828L17.72 4.07828L17.56 3.43828C17.5333 3.33161 17.5733 3.25161 17.68 3.19828C17.8133 3.14495 17.88 3.18495 17.88 3.31828L18.08 3.95828L18.32 4.51828L18.6 5.07828C18.6267 5.02495 18.6667 4.97161 18.72 4.91828L18.6 4.63828L18.6 4.59828L18.4 3.99828L18.16 3.31828L17.92 2.71828C17.8933 2.61161 17.92 2.53161 18 2.47828C18.1067 2.42495 18.1867 2.46495 18.24 2.59828L18.52 3.19828L18.76 3.87828L18.92 4.47828C19 4.39828 19.0533 4.25161 19.08 4.03828L18.8 3.39828L18.48 2.83828L18.48 2.79828L18.28 2.11828C18.2533 2.01161 18.28 1.93161 18.36 1.87828C18.4933 1.87828 18.5733 1.91828 18.6 1.99828L18.84 2.67828L19.12 3.23828L19.12 3.27828L19.36 3.83828L19.68 3.51828C19.7333 3.46495 19.7867 3.42495 19.84 3.39828L19.4 2.51828C19.4 2.51828 19.4 2.50495 19.4 2.47828C19.4 2.47828 19.3867 2.47828 19.36 2.47828L19.2 1.79828L18.88 1.15828C18.8267 1.05161 18.8533 0.971614 18.96 0.91828C19.0667 0.864947 19.1467 0.904947 19.2 1.03828L19.52 1.63828L19.52 1.67828L19.72 2.35828L20.16 3.23828C20.2933 3.18495 20.4133 3.13161 20.52 3.07828C20.6267 3.02495 20.7333 2.93161 20.84 2.79828L20.68 2.23828L20.4 1.59828L20.4 1.55828L20.24 0.95828C20.2133 0.851614 20.2533 0.771614 20.36 0.71828C20.4667 0.71828 20.5333 0.75828 20.56 0.83828L20.76 1.47828L21 2.11828L21.2 2.71828L21.28 2.91828C21.4133 2.91828 21.5067 2.86495 21.56 2.75828L21.28 2.07828L21.08 1.39828L20.84 0.71828C20.8133 0.611614 20.84 0.531614 20.92 0.47828C21.0267 0.424947 21.1067 0.464947 21.16 0.59828L21.44 1.27828L21.44 1.31828L21.6 1.95828L21.88 2.63828L21.96 2.83828C22.04 2.83828 22.12 2.79828 22.2 2.71828C22.2 2.69161 22.1867 2.67828 22.16 2.67828L22 2.03828L21.68 1.39828L21.4 0.79828C21.32 0.71828 21.3467 0.63828 21.48 0.55828C21.56 0.531614 21.64 0.55828 21.72 0.63828L22.04 1.23828L22.32 1.87828L22.32 1.91828L22.6 2.75828C22.6533 2.73161 22.72 2.71828 22.8 2.71828C22.88 2.71828 22.96 2.70495 23.04 2.67828L22.72 1.99828L22.48 1.35828L22.28 0.718281C22.2533 0.611614 22.28 0.531614 22.36 0.47828C22.4933 0.47828 22.5733 0.51828 22.6 0.598281L22.84 1.23828L23.04 1.87828L23.36 2.55828L23.36 2.59828L23.4 2.67828C23.4533 2.65161 23.56 2.63828 23.72 2.63828L23.52 2.07828L23.2 1.47828L22.96 0.838281C22.9067 0.731614 22.9333 0.651614 23.04 0.598281C23.1467 0.544947 23.2267 0.584947 23.28 0.718281L23.84 1.91828L23.84 1.95828L24.08 2.55828L24.08 2.59828L24.28 2.59828L24.12 2.19828L23.92 1.51828L23.72 0.918281C23.6933 0.811614 23.72 0.731614 23.8 0.678281C23.9067 0.624947 23.9867 0.664947 24.04 0.798281L24.28 1.39828L24.28 1.43828L24.44 2.07828L24.64 2.55828C24.72 2.55828 24.7867 2.54495 24.84 2.51828C24.92 2.51828 24.9867 2.51828 25.04 2.51828L24.8 1.99828L24.48 1.39828L24.48 1.35828L24.28 0.678281C24.2533 0.571614 24.28 0.491614 24.36 0.438281C24.4933 0.438281 24.5733 0.478281 24.6 0.558281L24.84 1.23828L25.4 2.51828C25.4533 2.51828 25.5067 2.50495 25.56 2.47828C25.64 2.47828 25.72 2.47828 25.8 2.47828L25.64 2.11828L25.36 1.43828L25.08 0.838281C25 0.758281 25.0267 0.678281 25.16 0.598281C25.24 0.571614 25.32 0.598281 25.4 0.678281L25.68 1.27828L25.72 1.27828L25.96 1.99828L26.16 2.47828L26.48 2.47828L26.36 2.07828L26.12 1.51828L25.88 0.838281C25.8533 0.731614 25.88 0.651614 25.96 0.598281C26.0667 0.544947 26.1467 0.584947 26.2 0.718281L26.48 1.35828L26.84 2.43828L26.92 2.43828C26.9733 2.41161 27.04 2.39828 27.12 2.39828L26.84 1.55828L26.68 0.998281C26.6533 0.891614 26.68 0.811614 26.76 0.758281C26.8933 0.758281 26.9733 0.798281 27 0.878281L27.36 2.03828L27.48 2.43828C27.5333 2.43828 27.56 2.42495 27.56 2.39828L27.56 2.35828L27.36 1.67828C27.3333 1.57161 27.36 1.49161 27.44 1.43828C27.5733 1.43828 27.6667 1.51828 27.72 1.67828L28 2.23828L28.28 3.03828L28.64 3.39828C28.5333 3.34495 28.44 3.30495 28.36 3.27828L28.48 3.51828L28.72 4.11828ZM1.96 4.55828L1.96 4.59828C2.09333 4.81161 2.22667 5.02495 2.36 5.23828C2.52 5.45161 2.65333 5.65161 2.76 5.83828C3.05333 6.29161 3.34667 6.74495 3.64 7.19828C3.96 7.65161 4.28 8.09161 4.6 8.51828C5.32 9.23828 5.94667 10.0383 6.48 10.9183C7.04 11.7983 7.69333 12.5983 8.44 13.3183L8.44 13.3583C9.05333 14.0249 9.57333 14.7449 10 15.5183C10.4267 16.2916 10.92 17.0116 11.48 17.6783L11.48 17.7183C11.6933 18.0116 11.8933 18.3183 12.08 18.6383C12.2667 18.9583 12.4533 19.2783 12.64 19.5983C12.7733 19.8116 12.8933 20.0516 13 20.3183C13.1333 20.6116 13.2933 20.8383 13.48 20.9983C13.6933 21.1316 13.92 21.2116 14.16 21.2383C14.4267 21.2916 14.6933 21.3183 14.96 21.3183L15.32 21.3183C15.3733 21.3183 15.4133 21.3183 15.44 21.3183C15.4667 21.3449 15.4933 21.3583 15.52 21.3583C15.5733 21.3583 15.6267 21.3583 15.68 21.3583C15.7333 21.3849 15.7867 21.3849 15.84 21.3583C15.9733 21.3316 16.12 21.3049 16.28 21.2783C16.44 21.2783 16.5733 21.2249 16.68 21.1183C16.8133 21.0383 16.92 20.9316 17 20.7983C17.1067 20.6649 17.2 20.5316 17.28 20.3983C17.6 20.0249 17.8933 19.6249 18.16 19.1983C18.4267 18.7983 18.6933 18.3983 18.96 17.9983C18.96 17.9716 18.96 17.9583 18.96 17.9583C18.9867 17.9583 19 17.9583 19 17.9583C19.6133 17.2916 20.16 16.5716 20.64 15.7983C21.12 15.0249 21.64 14.2916 22.2 13.5983L22.24 13.5983C22.7733 13.0649 23.1867 12.4249 23.48 11.6783C23.7733 10.9583 24.0667 10.2249 24.36 9.47828C24.68 8.75828 25.0933 8.11828 25.6 7.55828C25.8133 7.21161 26.0267 6.86495 26.24 6.51828C26.48 6.17161 26.7067 5.81161 26.92 5.43828C27.0533 5.25161 27.1867 5.06495 27.32 4.87828C27.48 4.71828 27.6133 4.53161 27.72 4.31828C27.88 4.53161 28.1467 4.54495 28.52 4.35828C28.44 4.35828 28.3867 4.30495 28.36 4.19828C28.28 4.30495 28.16 4.27828 28 4.11828C27.9467 4.06495 27.9067 4.01161 27.88 3.95828C27.88 3.87828 27.8933 3.81161 27.92 3.75828C27.9733 3.65161 28.0267 3.59828 28.08 3.59828L27.92 3.31828C27.92 3.31828 27.9067 3.31828 27.88 3.31828C27.88 3.31828 27.88 3.33161 27.88 3.35828C27.88 3.43828 27.84 3.47828 27.76 3.47828C27.76 3.50495 27.7333 3.51828 27.68 3.51828C27.6533 3.54495 27.64 3.57161 27.64 3.59828C27.64 3.62495 27.6267 3.65161 27.6 3.67828C27.44 3.51828 27.32 3.41161 27.24 3.35828L27.16 3.35828C27.16 3.43828 27.12 3.49161 27.04 3.51828C26.9067 3.51828 26.8267 3.47828 26.8 3.39828L26.64 3.39828C26.5867 3.42495 26.52 3.43828 26.44 3.43828C26.3867 3.49161 26.3467 3.51828 26.32 3.51828C26.2133 3.51828 26.1467 3.49161 26.12 3.43828L25.68 3.43828L25.6 3.51828C25.52 3.51828 25.4533 3.50495 25.4 3.47828C25.32 3.47828 25.2267 3.47828 25.12 3.47828C25.04 3.47828 24.96 3.49161 24.88 3.51828L24.76 3.51828C24.28 3.54495 23.7867 3.58495 23.28 3.63828C22.8 3.69161 22.32 3.75828 21.84 3.83828C21.5733 3.86495 21.2933 3.89161 21 3.91828C20.7333 3.97161 20.4933 4.09161 20.28 4.27828C20.0667 4.46495 19.88 4.70495 19.72 4.99828C19.56 5.31828 19.4133 5.59828 19.28 5.83828C19.04 6.29161 18.7867 6.73161 18.52 7.15828C18.28 7.58495 18.0267 8.01161 17.76 8.43828C17.4667 8.94495 17.1733 9.45161 16.88 9.95828C16.6133 10.4649 16.3333 10.9716 16.04 11.4783C15.9333 11.6383 15.8667 11.8116 15.84 11.9983C15.8133 12.1849 15.6667 12.2783 15.4 12.2783C15.2133 12.3049 15.08 12.2649 15 12.1583C14.9467 12.0783 14.8933 11.9716 14.84 11.8383C14.8133 11.7583 14.7733 11.6649 14.72 11.5583C14.64 11.4516 14.56 11.3449 14.48 11.2383C14.4267 11.1316 14.36 11.0249 14.28 10.9183C13.9333 10.3583 13.6 9.78495 13.28 9.19828C12.96 8.61161 12.6267 8.02495 12.28 7.43828C12.28 7.41161 12.2667 7.38495 12.24 7.35828C12.24 7.35828 12.24 7.34495 12.24 7.31828C12.2133 7.31828 12.1733 7.29161 12.12 7.23828L11.92 6.75828C11.8933 6.75828 11.88 6.74495 11.88 6.71828C11.8 6.66495 11.7467 6.62495 11.72 6.59828L11.48 6.07828C11.4267 6.07828 11.3733 6.03828 11.32 5.95828L11.2 5.67828C11.1733 5.65161 11.1467 5.61161 11.12 5.55828C11.0933 5.53161 11.0667 5.49161 11.04 5.43828C10.9867 5.38495 10.92 5.29161 10.84 5.15828C10.8133 5.10495 10.7733 5.03828 10.72 4.95828C10.6667 4.87828 10.6133 4.81161 10.56 4.75828C10.4533 4.62495 10.3467 4.47828 10.24 4.31828C10.16 4.15828 10.0533 4.02495 9.92 3.91828C9.68 3.75828 9.44 3.66495 9.2 3.63828C8.98667 3.61161 8.74667 3.59828 8.48 3.59828L8.32 3.59828C8.05333 3.59828 7.77333 3.59828 7.48 3.59828C7.18667 3.62495 6.89333 3.63828 6.6 3.63828C6.17333 3.66495 5.73333 3.67828 5.28 3.67828C4.85333 3.70495 4.41333 3.71828 3.96 3.71828L3.2 3.71828C3.17333 3.71828 3.14667 3.70495 3.12 3.67828C3.09333 3.67828 3.05333 3.67828 3 3.67828C2.81333 3.62495 2.68 3.62495 2.6 3.67828C2.36 3.78495 2.14667 4.07828 1.96 4.55828ZM27.72 4.31828C27.5867 4.18495 27.5467 3.97161 27.6 3.67828C27.68 3.78495 27.7733 3.87828 27.88 3.95828C27.8533 4.01161 27.84 4.05161 27.84 4.07828C27.84 4.10495 27.8267 4.13161 27.8 4.15828C27.8 4.15828 27.7733 4.21161 27.72 4.31828Z"
      fill="black"
      fillOpacity="0.2"
    />
  </svg>
)
