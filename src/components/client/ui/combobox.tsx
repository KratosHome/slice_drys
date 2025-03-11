import * as React from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '@/utils/cn'
import Button from '@/components/client/ui/button'
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
import { useController, UseControllerProps } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

interface ComboboxProps
  extends UseControllerProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'onSelect' | 'defaultValue' | 'name'
    > {
  elements: { value: string; label: string }[]
  selectedValue: { value: string; label: string }
  onSelect: ({
    value,
    label,
  }: {
    value: string
    label: string
  }) => Promise<void> | void
  placeholder: string
}

export function Combobox({
  name,
  rules,
  control,
  elements,
  selectedValue,
  onSelect,
  placeholder,
}: ComboboxProps) {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    rules,
    control,
  })
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="mt-6 grid grid-cols-[1fr_auto] rounded-md border border-input bg-transparent px-4 py-[15px] text-left !text-base font-normal !text-black shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[38vw] md:max-w-[550px] md:!text-xl"
        >
          <span className="truncate">
            {elements.find((element) => element.value === selectedValue.value)
              ?.label || placeholder}
          </span>
          {open ? (
            <ChevronUp className="opacity-50" />
          ) : (
            <ChevronDown className="opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[38vw] md:max-w-[550px]">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Спробуй змінити запит</CommandEmpty>
            <CommandGroup>
              {elements.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={(currentValue) => {
                    if (currentValue !== selectedValue.value)
                      onSelect(
                        elements.filter(
                          (element) => element.value === currentValue,
                        )[0],
                      )
                    setOpen(false)
                  }}
                >
                  {element.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedValue.value === element.value
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
      <ErrorMessage
        errors={errors}
        name={field.name}
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <p key={type} className="mt-1 text-xs text-red-600">
              {message}
            </p>
          ))
        }
      />
    </Popover>
  )
}
