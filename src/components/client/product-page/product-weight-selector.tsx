'use client'

import { useRef, useState } from 'react'
import { cn } from '@/utils/cn'

type ProductWeightControl =
  typeof import('./product-weight-selector-control').default

let controlPromise: Promise<ProductWeightControl> | undefined

const loadControl = () => {
  controlPromise ??= import('./product-weight-selector-control')
    .then((module) => module.default)
    .catch((error: unknown) => {
      controlPromise = undefined
      throw error
    })
  return controlPromise
}

export const productWeightTriggerClassName = cn(
  'border-input placeholder:text-muted-foreground focus:ring-ring flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs focus:ring-1 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&[data-popup-open]>span]:last:text-red-700 [&[data-popup-open]>span]:last:opacity-0',
  'bg-grey-select group flex w-fit gap-4 rounded-sm px-3 py-2 text-2xl font-bold',
  'border-foreground/15 relative h-[52px] min-w-28 rounded-lg bg-transparent text-xl font-medium shadow-none',
)

export interface ProductWeightSelectorProps {
  variables: Pick<IVariableProduct, 'weight'>[]
  weight: IVariableProduct['weight']
  unit: string
  label: string
  groupLabel: string
  onValueChange: (value: string) => void
}

export default function ProductWeightSelector(props: ProductWeightSelectorProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wantsOpen = useRef(false)
  const [Control, setControl] = useState<ProductWeightControl>()
  const [open, setOpen] = useState(false)

  const prepareControl = () => {
    // Warm the popup on intent without replacing the focused trigger.
    void loadControl().catch(() => undefined)
  }

  const openSelector = async () => {
    wantsOpen.current = true
    try {
      const loadedControl = await loadControl()
      if (!triggerRef.current || !wantsOpen.current) return
      setOpen(true)
      setControl(() => loadedControl)
    } catch {
      wantsOpen.current = false
      // Keep the trigger available so the next interaction can retry.
    }
  }

  const cancelOpening = () => {
    wantsOpen.current = false
    setOpen(false)
  }

  if (Control) {
    return <Control {...props} open={open} onOpenChange={setOpen} />
  }

  return (
    <button
      ref={triggerRef}
      id="weight"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={false}
      aria-controls={open ? 'weight-options' : undefined}
      className={productWeightTriggerClassName}
      onPointerEnter={prepareControl}
      onPointerDown={prepareControl}
      onFocus={prepareControl}
      onClick={openSelector}
      onBlur={cancelOpening}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          void openSelector()
        } else if (event.key === 'Escape') {
          cancelOpening()
        }
      }}
    >
      <label
        htmlFor="weight"
        className="text-muted-foreground absolute -top-6 left-0 text-sm font-normal"
      >
        {props.label}
      </label>
      <span>
        {props.weight} {props.unit}.
      </span>
      <span
        aria-hidden="true"
        className="font-rubik flex shrink-0 rotate-90 items-center justify-center text-xl transition-all duration-200 will-change-transform group-hover:scale-110 group-hover:text-red-700 sm:text-2xl md:text-4xl"
      >
        {'>'}
      </span>
    </button>
  )
}
