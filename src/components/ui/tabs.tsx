'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Tabs = TabsPrimitive.Root
const TabsList = forwardRef<
  HTMLDivElement,
  Omit<TabsPrimitive.List.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'
const TabsTrigger = forwardRef<
  HTMLButtonElement,
  Omit<TabsPrimitive.Tab.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring data-[active]:bg-background data-[active]:text-foreground inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[active]:shadow-sm',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'
const TabsContent = forwardRef<
  HTMLDivElement,
  Omit<TabsPrimitive.Panel.Props, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'
export { Tabs, TabsList, TabsTrigger, TabsContent }
