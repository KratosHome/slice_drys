import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useController, UseControllerProps } from 'react-hook-form'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/admin/ui/skeleton'
import Button from '@/components/client/ui/button'
import { ErrorMessage } from '@hookform/error-message'
import { useDebounce } from 'use-debounce'
import { CommandLoading } from 'cmdk'
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

import { useCartStore } from '@/store/cartStore'
import { getNPBranchesByCityRef } from '@/server/delivery/get-branches.server'
import {
  getDefaultNPCitiesFromDictionary,
  getNPCitiesFromDictionary,
} from '@/server/delivery/get-cities.server'
import { cn } from '@/utils/cn'

interface ComboboxProps
  extends UseControllerProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'onSelect' | 'defaultValue' | 'name'
    > {
  onSelect: ({ value, label }: IComboboxData) => Promise<void> | void
  placeholder: string
  defaultValues?: IComboboxData[]
}

type TransformingDataType<
  T extends IDirectoryCity | IDirectoryBranch | IComboboxData,
> = T extends IDirectoryCity | IDirectoryBranch
  ? IComboboxData
  : IDirectoryCity | IDirectoryBranch

export function transformToCombo<
  T extends IDirectoryCity | IDirectoryBranch | IComboboxData,
>(data: T, toType?: 'city' | 'branch'): TransformingDataType<T> {
  if ('ref' in data && 'city' in data) {
    return {
      value: data.ref,
      label: data.city,
    } as TransformingDataType<T>
  } else if ('branchRef' in data && 'branchName' in data) {
    return {
      value: data.branchRef,
      label: data.branchName,
    } as TransformingDataType<T>
  } else if ('value' in data && 'label' in data) {
    return toType === 'city'
      ? ({
          ref: data.value,
          city: data.label,
        } as TransformingDataType<T>)
      : ({
          branchRef: data.value,
          branchName: data.label,
        } as TransformingDataType<T>)
  } else {
    console.error('Unsupported type provided to transformToCombo')
    return {} as TransformingDataType<T>
  }
}

const handleCitySearch = async (city?: string) => {
  let allCities
  if (city) {
    allCities = await getNPCitiesFromDictionary(city)
  } else {
    allCities = await getDefaultNPCitiesFromDictionary()
  }
  return allCities ? allCities.map((c) => transformToCombo(c)) : []
}

const handleBranchSearch = async (
  // branchType: Omit<IDeliveryMethods, 'courier'>,
  cityRef?: string,
) => {
  if (!cityRef) return []
  const branches = await getNPBranchesByCityRef(cityRef)
  return branches ?? []
  // return (
  //   branches
  //     ?.filter((branch) => branch.branchType.toLowerCase() === branchType)
  //     .map((branch) => transformToCombo(branch, 'branch')) ?? []
  // )
}

const Loading = () => {
  return (
    <CommandLoading>
      <div className="flex flex-col items-center gap-2 p-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full bg-gray-200" />
        ))}
      </div>
    </CommandLoading>
  )
}
export function Combobox({
  defaultValues,
  name,
  rules,
  control,
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

  const t = useTranslations('order')

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearchValue] = useDebounce(search, 500)
  const [elements, setElements] = useState<
    IComboboxData[] | IDirectoryBranch[]
  >([])
  const [loading, setLoading] = useState(false)

  const deliveryInfo = useCartStore(
    (state) => state.cart.userData?.deliveryInfo,
  )
  const deliveryMethod = useCartStore(
    (state) => state.cart.userData?.deliveryInfo?.deliveryMethod,
  )

  const handleUpdateDataList = useMemo(() => {
    if (name === 'deliveryInfo.city') {
      return handleCitySearch
    } else {
      return () => handleBranchSearch(deliveryInfo?.city?.value)
    }
  }, [name, deliveryInfo])

  useEffect(() => {
    if (name === 'deliveryInfo.branch') {
      setElements([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryInfo?.city?.value])

  useEffect(() => {
    if (name === 'deliveryInfo.city') {
      ;(async () => {
        setLoading(true)
        try {
          const data = (await handleUpdateDataList(
            debouncedSearchValue,
          )) as IComboboxData[]

          setElements(data)
        } catch (error) {
          console.error(
            `Error fetching data with (${name.split('.')[1]}): `,
            error,
          )
          setElements([])
        } finally {
          setLoading(false)
        }
      })()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue, handleUpdateDataList])

  // Початкове завантаження даних
  useEffect(() => {
    if (open && elements.length === 0 && !debouncedSearchValue) {
      if (defaultValues) {
        setElements(defaultValues)
        return
      }
      ;(async () => {
        setLoading(true)
        try {
          const data = await handleUpdateDataList(undefined)
          setElements(data)
        } catch (error) {
          console.error(
            `Error fetching initial data (${name.split('.')[1]}): `,
            error,
          )
          setElements([])
        } finally {
          setLoading(false)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, handleUpdateDataList, debouncedSearchValue, elements.length])

  const selectedValue =
    name === 'deliveryInfo.city'
      ? deliveryInfo?.city || { value: '', label: '' }
      : deliveryInfo?.branch || { value: '', label: '' }

  // Фільтруємо елементи по debouncedSearchValue тільки для відділень
  const filteredElements = elements.every(
    (el): el is IDirectoryBranch => 'branchType' in el,
  )
    ? (elements as IDirectoryBranch[])
        .filter((el) => el.branchType.toLowerCase() === deliveryMethod)
        .map((el) => transformToCombo<IDirectoryBranch>(el))
        .filter((element) =>
          debouncedSearchValue
            ? element.label
                .toLowerCase()
                .includes(debouncedSearchValue.toLowerCase())
            : true,
        )
    : elements

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className="grid w-full grid-cols-[1fr_auto] rounded-md border border-input bg-transparent px-4 py-[15px] text-left !text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal !text-black shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[38vw] lg:max-w-[550px]"
          >
            <span className="truncate">
              {selectedValue.label || placeholder}
            </span>
            {open ? (
              <ChevronUp className="opacity-50" />
            ) : (
              <ChevronDown className="opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-40px)] max-w-[550px] p-0 lg:w-[38vw]">
          <Command>
            <CommandInput
              placeholder={placeholder}
              className="h-9"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <CommandEmpty>
                    {name === 'deliveryInfo.city'
                      ? t('city_search_placeholder')
                      : t('branch_search_placeholder', {
                          type: deliveryInfo?.deliveryMethod,
                        })}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredElements.map((element) => (
                      <CommandItem
                        key={element.label}
                        value={element.label}
                        onSelect={(currentValue) => {
                          if (currentValue !== selectedValue.label) {
                            const selectedElement = filteredElements.find(
                              (el) => el.label === currentValue,
                            )
                            if (selectedElement) onSelect(selectedElement)
                          }
                          setOpen(false)
                        }}
                      >
                        {element.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            selectedValue.label === element.label
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
    </div>
  )
}
