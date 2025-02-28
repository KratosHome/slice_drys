'use client'
import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/client/ui/dialog'
import { Button } from '@/components/admin/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import CheckboxRoot from '@/components/client/ui/checkbox-root'
import CheckboxIndicator from '@/components/client/ui/checkbox-indicator'
import { Slider } from '@/components/client/ui/slider'

interface ProductFiltersProps {
  categories: ICategory[]
  weights: string[]
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  weights,
  categories,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale() as ILocale

  const numericWeights = weights.map(Number)

  const getInitialCategories = () => {
    const params = searchParams.get('categories')
    return params ? params.split(',') : []
  }

  const getInitialSliderValues = () => {
    const minWeight = Number(searchParams.get('minWeight')) || numericWeights[0]
    const maxWeight =
      Number(searchParams.get('maxWeight')) ||
      numericWeights[numericWeights.length - 1]
    return [minWeight, maxWeight]
  }

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(getInitialCategories)
  const [sliderValue, setSliderValue] = useState<number[]>(
    getInitialSliderValues,
  )

  const [debouncedSliderValue] = useDebounce(sliderValue, 300)

  useEffect(() => {
    setSelectedCategories(getInitialCategories())
    setSliderValue(getInitialSliderValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const updateUrlParams = (params: URLSearchParams) => {
    const newUrl = `?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
    router.refresh()
  }

  const updateCategoriesQuery = (updatedCategories: string[]) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (updatedCategories.length > 0) {
      params.set('categories', updatedCategories.join(','))
    } else {
      params.delete('categories')
    }
    // Заміна router.push на window.history.replaceState для уникнення перезавантаження
    updateUrlParams(params)
  }

  const handleToggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(updatedCategories)
    updateCategoriesQuery(updatedCategories)
  }

  // Оновлення параметрів minWeight та maxWeight без перезавантаження сторінки
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    if (
      debouncedSliderValue[0] !== numericWeights[0] ||
      debouncedSliderValue[1] !== numericWeights[numericWeights.length - 1]
    ) {
      params.set('minWeight', debouncedSliderValue[0].toString())
      params.set('maxWeight', debouncedSliderValue[1].toString())
    } else {
      params.delete('minWeight')
      params.delete('maxWeight')
    }

    updateUrlParams(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSliderValue])

  return (
    <div className="relative w-full max-w-none grow">
      <div className="flex items-center gap-2 py-[16px]">
        <div className="hidden w-full max-w-80 grow md:block">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex w-full items-center justify-between gap-2.5 bg-[#0F0F0F] p-4 text-4xl text-[#FBFBFB]">
                Вид
              </AccordionTrigger>
              <AccordionContent className="relative z-0 flex flex-col">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.slug}
                      htmlFor={category.slug}
                      className="relative z-0 flex cursor-pointer items-center gap-6"
                    >
                      <CheckboxPrimitive.Root
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() =>
                          handleToggleCategory(category.slug)
                        }
                        className="relative z-0 py-3"
                      >
                        <CheckboxRoot />
                        <CheckboxPrimitive.Indicator>
                          <CheckboxIndicator />
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>
                      <span className="text-xl">{category.name[locale]}</span>
                    </label>
                  ))
                ) : (
                  <div>Немає доступних категорій.</div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            defaultValue="item-2"
            className="mt-4"
          >
            <AccordionItem value="item-2">
              <AccordionTrigger className="flex w-full items-center justify-between gap-2.5 bg-[#0F0F0F] p-4 text-4xl text-[#FBFBFB]">
                Вага
              </AccordionTrigger>
              <AccordionContent>
                <div className="mx-auto max-w-sm">
                  <div className="p-4">
                    <Slider
                      value={sliderValue}
                      step={1}
                      min={numericWeights[0]}
                      max={numericWeights[numericWeights.length - 1]}
                      onValueChange={(value) => setSliderValue(value)}
                    />
                    <div className="flex justify-between text-sm">
                      <span>Від {sliderValue[0]} г</span>
                      <span>До {sliderValue[1]} г</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Dialog>
          <DialogTrigger className="flex items-center gap-2 md:hidden">
            <div className="text-xl sm:text-2xl">Фільтр</div>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[32px]">Фільтр</DialogTitle>
              <DialogDescription>
                <div className="flex items-center justify-between pb-[40px] pt-[60px]">
                  <Button
                    className="rounded-none text-base"
                    variant="outline"
                    type="button"
                    size="lg"
                  >
                    Скинути все
                  </Button>
                  <Button
                    className="rounded-none text-base"
                    type="button"
                    size="lg"
                  >
                    Показати
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProductFilters
