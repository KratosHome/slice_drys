'use client'

import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorMessage } from '@hookform/error-message'
import { CommandLoading } from 'cmdk'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import {
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
import { type UseControllerProps, useController } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { useCartStore } from '@/store/cart-store'
import { getNPBranchesByCityRef } from '@/server/delivery/get-branches.server'
import {
  getDefaultNPCitiesFromDictionary,
  getNPCitiesFromDictionary,
} from '@/server/delivery/get-cities.server'
import { cn } from '@/utils/cn'

interface IComboboxProps
  extends
    UseControllerProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
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

const handleCitySearch = async (city?: string): Promise<IComboboxData[]> => {
  let allCities

  if (city) {
    allCities = await getNPCitiesFromDictionary(city)
  } else {
    allCities = await getDefaultNPCitiesFromDictionary()
  }

  return allCities
    ? allCities.map((cityData) => transformToCombo(cityData))
    : []
}

const handleBranchSearch = async (
  cityRef?: string,
): Promise<IDirectoryBranch[]> => {
  if (!cityRef) return []

  return getNPBranchesByCityRef(cityRef)
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
}: IComboboxProps) {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    rules,
    control,
  })

  const t = useTranslations('order')

  const [open, setOpen] = useState<boolean>(false)

  const [search, setSearch] = useState<string>('')
  const [debouncedSearchValue] = useDebounce<string>(search, 500)

  const [elements, setElements] = useState<
    IComboboxData[] | IDirectoryBranch[]
  >([])

  const [loading, setLoading] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)
  const requestIdRef = useRef(0)

  const deliveryInfo = useCartStore(
    (state) => state.cart.userData?.deliveryInfo,
  )
  const deliveryMethod = useCartStore(
    (state) => state.cart.userData?.deliveryInfo?.deliveryMethod,
  )

  const cityRef = deliveryInfo?.city?.value

  const handleUpdateDataList = useCallback(
    (searchValue?: string) =>
      name === 'deliveryInfo.city'
        ? handleCitySearch(searchValue)
        : handleBranchSearch(cityRef),
    [cityRef, name],
  )

  const loadData = useCallback(
    async (searchValue?: string) => {
      const requestId = ++requestIdRef.current
      setLoading(true)
      setLoadError(false)

      try {
        const data = await handleUpdateDataList(searchValue)

        if (requestId === requestIdRef.current) setElements(data)
      } catch (error) {
        console.error(`Error fetching data (${name.split('.')[1]}): `, error)

        if (requestId === requestIdRef.current) {
          setElements([])
          setLoadError(true)
        }
      } finally {
        if (requestId === requestIdRef.current) setLoading(false)
      }
    },
    [handleUpdateDataList, name],
  )

  useEffect(
    () => () => {
      requestIdRef.current += 1
    },
    [],
  )

  // Load branches as soon as a city is selected, before the dropdown opens.
  useEffect(() => {
    if (name !== 'deliveryInfo.branch') return

    requestIdRef.current += 1
    setSearch('')
    setElements([])
    setLoadError(false)

    if (cityRef) void loadData()
  }, [cityRef, loadData, name])

  useEffect(() => {
    if (name === 'deliveryInfo.city') void loadData(debouncedSearchValue)
  }, [debouncedSearchValue, loadData, name])

  // Початкове завантаження даних
  useEffect(() => {
    if (open && elements.length === 0 && !debouncedSearchValue && !loading) {
      if (defaultValues) {
        setElements(defaultValues)
        return
      }

      void loadData()
    }
  }, [
    debouncedSearchValue,
    defaultValues,
    elements.length,
    loadData,
    loading,
    open,
  ])

  const selectedValue: IComboboxData =
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
            aria-busy={loading}
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring text-foreground hover:bg-foreground/10 grid h-16 w-full grid-cols-[1fr_auto] rounded-md border bg-transparent px-4 py-[15px] text-left text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
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
        <PopoverContent
          className="w-[calc(100vw-40px)] max-w-[575px] p-0 lg:w-[45vw]"
          asChild
        >
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
              ) : loadError ? (
                <div
                  role="alert"
                  className="flex flex-col items-center gap-3 p-4 text-center text-sm"
                >
                  <p>{t('directory-load-error')}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void loadData(
                        name === 'deliveryInfo.city'
                          ? debouncedSearchValue
                          : undefined,
                      )
                    }
                  >
                    {t('btn-retry')}
                  </Button>
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {name === 'deliveryInfo.city'
                      ? t('city-search-placeholder')
                      : t('branch-search-placeholder', {
                          type: deliveryInfo?.deliveryMethod || '',
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
