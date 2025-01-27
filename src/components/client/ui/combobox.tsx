import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/utils/cn'
import { Button } from '@/components/admin/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/client/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/client/ui/popover'

interface ComboboxDemoProps {
  elements: { value: string; label: string }[]
  selectedValue: string
  onSelect: (value: string) => void
}

export function ComboboxDemo({
  elements,
  selectedValue,
  onSelect,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue
            ? elements.find((element) => element.value === selectedValue)?.label
            : 'Select...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search" className="h-9" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {elements.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === selectedValue ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {element.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedValue === element.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
