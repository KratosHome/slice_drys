'use client'

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorMessage } from '@hookform/error-message'
import { Button } from '@/components/ui/button'

import {
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
import {
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { useCartStore } from '@/store/cart-store'
import { getNPBranchesByCityRef } from '@/server/delivery/get-branches.server'
import {
  getDefaultNPCitiesFromDictionary,
  getNPCitiesFromDictionary,
} from '@/server/delivery/get-cities.server'

interface IComboboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues,
>
  extends
    UseControllerProps<TFieldValues, TName, TTransformedValues>,
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
    <ComboboxPrimitive.Status>
      <div className="flex flex-col items-center gap-2 p-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full bg-gray-200" />
        ))}
      </div>
    </ComboboxPrimitive.Status>
  )
}

export function Combobox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  defaultValues,
  name,
  rules,
  control,
  onSelect,
  placeholder,
}: IComboboxProps<TFieldValues, TName, TTransformedValues>) {
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
  >(defaultValues ?? [])

  const [loading, setLoading] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)
  const requestIdRef = useRef(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const selectedValue: IComboboxData =
    name === 'deliveryInfo.city'
      ? deliveryInfo?.city || { value: '', label: '' }
      : deliveryInfo?.branch || { value: '', label: '' }

  // Hide results for the previous city query while its replacement is debounced.
  const isLoading =
    loading ||
    (name === 'deliveryInfo.city' && search !== debouncedSearchValue)

  // Branches are already loaded for the city, so filter them immediately.
  const filteredElements = elements.every(
    (el): el is IDirectoryBranch => 'branchType' in el,
  )
    ? (elements as IDirectoryBranch[])
        .filter((el) => el.branchType.toLowerCase() === deliveryMethod)
        .map((el) => transformToCombo<IDirectoryBranch>(el))
        .filter((element) =>
          search
            ? element.label
                .toLowerCase()
                .includes(search.toLowerCase())
            : true,
        )
    : elements

  // Keep the selected record available even when async search returns a
  // different result window. Match by its stable directory ID after refetches.
  const knownElements =
    selectedValue.value &&
    !filteredElements.some((element) => element.value === selectedValue.value)
      ? [selectedValue, ...filteredElements]
      : filteredElements

  return (
    <div>
      <ComboboxPrimitive.Root<IComboboxData>
        items={knownElements}
        filteredItems={isLoading || loadError ? [] : filteredElements}
        filter={null}
        autoHighlight
        value={selectedValue.value ? selectedValue : null}
        isItemEqualToValue={(item, value) => item.value === value.value}
        open={open}
        onOpenChange={setOpen}
        inputValue={search}
        onInputValueChange={setSearch}
        onValueChange={(element) => {
          if (element && element.value !== selectedValue.value) {
            void onSelect(element)
          }
        }}
      >
        <ComboboxPrimitive.Trigger
          ref={field.ref}
          onBlur={field.onBlur}
          aria-label={placeholder}
          aria-busy={isLoading}
          render={
            <Button
              type="button"
              aria-busy={isLoading}
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring text-foreground hover:bg-foreground/10 grid h-16 w-full grid-cols-[1fr_auto] rounded-md border bg-transparent px-4 py-[15px] text-left text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            />
          }
        >
          <span className="truncate">{selectedValue.label || placeholder}</span>

          {open ? (
            <ChevronUp className="opacity-50" />
          ) : (
            <ChevronDown className="opacity-50" />
          )}
        </ComboboxPrimitive.Trigger>
        <ComboboxPrimitive.Portal>
          <ComboboxPrimitive.Positioner
            align="start"
            sideOffset={4}
            className="z-50"
          >
            <ComboboxPrimitive.Popup
              initialFocus={searchInputRef}
              aria-label={placeholder}
              aria-busy={isLoading}
              className="bg-popover text-popover-foreground w-[calc(100vw-40px)] max-w-[575px] overflow-hidden rounded-md border p-0 shadow-md outline-hidden lg:w-[45vw]"
            >
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 size-4 shrink-0 opacity-50" />
                <ComboboxPrimitive.Input
                  ref={searchInputRef}
                  aria-label={placeholder}
                  placeholder={placeholder}
                  className="placeholder:text-muted-foreground h-9 w-full bg-transparent py-3 text-sm outline-hidden"
                  onKeyDown={(event) => {
                    // Async loading clears Base UI's automatic highlight. Keep
                    // Enter selecting the first result once that request finishes.
                    if (
                      event.key !== 'Enter' ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.metaKey ||
                      event.nativeEvent.isComposing ||
                      event.nativeEvent.keyCode === 229 ||
                      !open ||
                      isLoading ||
                      loadError ||
                      event.currentTarget.getAttribute('aria-activedescendant')
                    ) {
                      return
                    }

                    const firstElement = filteredElements[0]
                    if (!firstElement) return

                    event.preventBaseUIHandler()
                    event.preventDefault()
                    event.stopPropagation()
                    if (firstElement.value !== selectedValue.value) {
                      void onSelect(firstElement)
                    }
                    setOpen(false)
                    setSearch('')
                  }}
                />
              </div>
              <div className="max-h-[300px] overflow-x-hidden overflow-y-auto">
                {isLoading ? (
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
                    <ComboboxPrimitive.Empty className="py-6 text-center text-sm">
                      {name === 'deliveryInfo.city'
                        ? t('city-search-placeholder')
                        : t('branch-search-placeholder', {
                            type: deliveryInfo?.deliveryMethod || '',
                          })}
                    </ComboboxPrimitive.Empty>
                    <ComboboxPrimitive.List
                      className="p-1"
                      aria-label={placeholder}
                    >
                      {(element: IComboboxData) => (
                        <ComboboxPrimitive.Item
                          key={element.value}
                          value={element}
                          className="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50"
                        >
                          {element.label}
                          <ComboboxPrimitive.ItemIndicator className="ml-auto">
                            <Check className="size-4" />
                          </ComboboxPrimitive.ItemIndicator>
                        </ComboboxPrimitive.Item>
                      )}
                    </ComboboxPrimitive.List>
                  </>
                )}
              </div>
            </ComboboxPrimitive.Popup>
          </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
      </ComboboxPrimitive.Root>
      <ErrorMessage<FieldErrors>
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
