import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import { motion } from 'framer-motion'

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
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      value={currentValue}
      onValueChange={handleValueChange}
      {...rest}
    >
      <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="bg-slider flex size-max cursor-pointer items-center justify-center rounded-full bg-background bg-cover bg-center font-rubik text-[35px] transition-colors focus:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
        <Image
          src="/icons/group.svg"
          alt="icon"
          width={50}
          height={50}
          className="object-contain"
        />
      </SliderPrimitive.Thumb>

      <SliderPrimitive.Thumb className="bg-slider flex size-max cursor-pointer items-center justify-center rounded-full bg-background bg-cover bg-center font-rubik text-[35px] transition-colors focus:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Image
            src="/icons/group.svg"
            alt="icon"
            width={50}
            height={50}
            className="object-contain"
          />
        </motion.div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
