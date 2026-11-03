'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/doodle-select'
import {
  productWeightTriggerClassName,
  type ProductWeightSelectorProps,
} from './product-weight-selector'

interface ProductWeightSelectorControlProps extends ProductWeightSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductWeightSelectorControl({
  variables,
  weight,
  unit,
  label,
  groupLabel,
  onValueChange,
  open,
  onOpenChange,
}: ProductWeightSelectorControlProps) {
  return (
    <Select
      value={String(weight)}
      open={open}
      onOpenChange={onOpenChange}
      onValueChange={(value) => {
        if (value !== null) onValueChange(value)
      }}
    >
      <SelectTrigger id="weight" className={productWeightTriggerClassName}>
        <label
          htmlFor="weight"
          className="text-muted-foreground absolute -top-6 left-0 text-sm font-normal"
        >
          {label}
        </label>
        <SelectValue placeholder={groupLabel}>
          {weight} {unit}.
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-grey-select">
        <SelectGroup>
          <SelectLabel>{groupLabel}</SelectLabel>
          {variables.map((variable) => (
            <SelectItem key={variable.weight} value={String(variable.weight)}>
              {variable.weight} {unit}.
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
