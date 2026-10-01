'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Accordion = AccordionPrimitive.Root
const AccordionItem = forwardRef<
  HTMLDivElement,
  Omit<AccordionPrimitive.Item.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'
const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  Omit<AccordionPrimitive.Trigger.Props, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-between rounded-[0.125rem] px-6 py-2 text-left text-sm font-medium transition-all [&[data-panel-open]>span]:rotate-270',
        'text-background bg-foreground text-base font-normal sm:text-xl md:text-2xl',
        className,
      )}
      {...props}
    >
      {children}
      <span className="font-rubik text-background flex h-6 w-6 shrink-0 rotate-90 items-center justify-center text-xl transition-transform duration-200 sm:text-2xl md:text-4xl">
        {'>'}
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'
const AccordionContent = forwardRef<
  HTMLDivElement,
  Omit<AccordionPrimitive.Panel.Props, 'className'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className="-ml-8 h-[var(--accordion-panel-height)] overflow-hidden pl-8 text-sm transition-[height] duration-200 data-[ending-style]:h-0 data-[starting-style]:h-0"
    {...props}
  >
    <div
      className={cn(
        'flex flex-col border-dotted border-black text-base md:text-xl',
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Panel>
))
AccordionContent.displayName = 'AccordionContent'
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
