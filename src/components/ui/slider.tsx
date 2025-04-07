import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/utils/cn'
import { LazyMotion, domAnimation, m } from 'framer-motion'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>((props, ref) => {
  const { className, value, defaultValue, onValueChange, ...rest } = props
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<number[]>(
    defaultValue || [0, 0],
  )
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (val: number[]) => {
    if (!isControlled) setInternalValue(val)
    if (onValueChange) {
      onValueChange(val)
    }
  }

  return (
    <SliderPrimitive.Root
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
        <SliderPrimitive.Track className="bg-primary/20 relative h-[2px] w-full grow overflow-hidden rounded-full">
          <SliderPrimitive.Range className="bg-primary absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="bg-slider bg-background font-rubik flex size-max cursor-pointer items-center justify-center rounded-full bg-cover bg-center text-[35px] transition-colors focus:outline-hidden focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
          <m.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-[50px] w-[50px] bg-[url('/icons/o-circle.png')] bg-contain bg-no-repeat dark:bg-[url('/icons/o-circle-light.png')]"
          />
        </SliderPrimitive.Thumb>

        <SliderPrimitive.Thumb className="bg-slider bg-background font-rubik flex size-max cursor-pointer items-center justify-center rounded-full bg-cover bg-center pr-1 text-[35px] transition-colors focus:outline-hidden focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
          <m.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-[50px] w-[50px] bg-[url('/icons/o-circle.png')] bg-contain bg-no-repeat dark:bg-[url('/icons/o-circle-light.png')]"
          />
        </SliderPrimitive.Thumb>
      </LazyMotion>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
