'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { LazyMotion, domAnimation, m } from 'framer-motion'

const Slider = forwardRef<
  HTMLDivElement,
  Omit<SliderPrimitive.Root.Props<number[]>, 'className'> & {
    className?: string
  }
>(({ className, value, defaultValue, min = 0, max = 100, ...props }, ref) => {
  const values = value ?? defaultValue ?? [min, max]
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('w-full', className)}
      value={value}
      defaultValue={defaultValue ?? [min, max]}
      min={min}
      max={max}
      thumbAlignment="edge"
      thumbCollisionBehavior="swap"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none">
        <LazyMotion features={domAnimation}>
          <SliderPrimitive.Track className="bg-primary/20 relative h-[2px] w-full grow overflow-hidden rounded-full">
            <SliderPrimitive.Indicator className="bg-primary absolute h-full" />
          </SliderPrimitive.Track>
          {values.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              className={cn(
                'bg-slider bg-background font-rubik flex size-max cursor-pointer items-center justify-center rounded-full bg-cover bg-center text-[35px] transition-colors focus:outline-hidden focus-visible:ring-0 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                index === 1 && 'pr-1',
              )}
            >
              <m.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="h-[50px] w-[50px] bg-[url('/icons/o-circle.png')] bg-contain bg-no-repeat dark:bg-[url('/icons/o-circle-light.png')]"
              />
            </SliderPrimitive.Thumb>
          ))}
        </LazyMotion>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = 'Slider'
export { Slider }
