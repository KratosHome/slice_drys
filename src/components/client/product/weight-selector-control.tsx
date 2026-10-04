'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  weightTriggerClassName,
  type WeightSelectorProps,
} from './weight-selector'

interface WeightSelectorControlProps extends WeightSelectorProps {
  id: string
  restoreFocus: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WeightSelectorControl({
  id,
  restoreFocus,
  variables,
  weight,
  unit,
  label,
  onValueChange,
  open,
  onOpenChange,
}: WeightSelectorControlProps) {
  return (
    <Select
      id={id}
      value={String(weight)}
      open={open}
      onOpenChange={onOpenChange}
      onValueChange={(value) => {
        if (value !== null) onValueChange(value)
      }}
    >
      <SelectTrigger
        className={weightTriggerClassName}
        aria-label={label}
        autoFocus={restoreFocus && !open}
      >
        <SelectValue>
          {weight} {unit}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {variables.map((variable) => (
            <SelectItem
              key={variable._id ?? variable.weight}
              value={String(variable.weight)}
            >
              {variable.weight} {unit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
