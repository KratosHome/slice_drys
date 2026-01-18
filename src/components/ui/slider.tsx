'use client'

import { Root, Track, Range, Thumb } from '@radix-ui/react-slider'

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  useState,
} from 'react'
import { cn } from '@/utils/cn'
import { LazyMotion, domAnimation, m } from 'framer-motion'

const Slider = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>((props, ref) => {
  const { className, value, defaultValue, onValueChange, ...rest } = props

  const isControlled: boolean = value !== undefined

  const [internalValue, setInternalValue] = useState<number[]>(
    defaultValue || [0, 0],
  )

  const currentValue: number[] | undefined = isControlled
    ? value
    : internalValue

  const handleValueChange = (val: number[]): void => {
    if (!isControlled) setInternalValue(val)
    if (onValueChange) onValueChange(val)
  }

  return (
    <Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none items-center select-none',
        className,
      )}
      value={currentValue}
      onValueChange={handleValueChange}
      {...rest}
    >
      <LazyMotion features={domAnimation}>
        <Track className="bg-primary/20 relative h-[2px] w-full grow overflow-hidden rounded-full">
          <Range className="bg-primary absolute h-full" />
        </Track>
        <Thumb className="bg-slider bg-background font-rubik flex size-max cursor-pointer items-center justify-center rounded-full bg-cover bg-center text-[35px] transition-colors focus:outline-hidden focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
          <m.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-[50px] w-[50px] bg-[url('/icons/o-circle.png')] bg-contain bg-no-repeat dark:bg-[url('/icons/o-circle-light.png')]"
          />
        </Thumb>
        <Thumb className="bg-slider bg-background font-rubik flex size-max cursor-pointer items-center justify-center rounded-full bg-cover bg-center pr-1 text-[35px] transition-colors focus:outline-hidden focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
          <m.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-[50px] w-[50px] bg-[url('/icons/o-circle.png')] bg-contain bg-no-repeat dark:bg-[url('/icons/o-circle-light.png')]"
          />
        </Thumb>
      </LazyMotion>
    </Root>
  )
})

Slider.displayName = Root.displayName

export { Slider }
