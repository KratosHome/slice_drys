'use client'

import { useId, useRef, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

type WeightSelectorControlComponent =
  typeof import('./weight-selector-control').default

const loadControl = () =>
  import('./weight-selector-control').then((module) => module.default)

export const weightTriggerClassName =
  'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-fit items-center justify-between gap-2 rounded-md border-none bg-transparent px-3 py-1 text-sm whitespace-nowrap shadow-none outline-hidden focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'

export interface WeightSelectorProps {
  variables: Pick<IVariableProduct, '_id' | 'weight'>[]
  weight: IVariableProduct['weight']
  unit: string
  label: string
  onValueChange: (value: string) => void
}

export default function WeightSelector(props: WeightSelectorProps) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [Control, setControl] = useState<WeightSelectorControlComponent>()
  const [restoreFocus, setRestoreFocus] = useState(false)
  const [open, setOpen] = useState(false)

  const openSelector = async () => {
    setOpen(true)
    try {
      const loadedControl = await loadControl()
      if (!triggerRef.current) return
      setRestoreFocus(document.activeElement === triggerRef.current)
      setControl(() => loadedControl)
    } catch {
      setOpen(false)
    }
  }

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      data-slot="select-trigger"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? `${id}-list` : undefined}
      aria-label={props.label}
      className={weightTriggerClassName}
      onClick={openSelector}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          openSelector()
        } else if (event.key === 'Escape') {
          setOpen(false)
        }
      }}
    >
      <span>
        {props.weight} {props.unit}
      </span>
      <ChevronDownIcon className="h-4 w-4 opacity-50" aria-hidden="true" />
    </button>
  )

  return Control ? (
    <Control
      {...props}
      id={id}
      open={open}
      onOpenChange={setOpen}
      restoreFocus={restoreFocus}
    />
  ) : (
    trigger
  )
}
