'use client'

import React, { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import CheckboxRoot from '@/components/client/ui/checkbox-root'
import CheckboxIndicator from '@/components/client/ui/checkbox-indicator'
import { useRouter, useSearchParams } from 'next/navigation'
import categoryMap from '@/data/prodcuts/categoryMap'

interface ProductSidebarProps {
  locale: string
  menu: string
  categories: string[]
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  locale,
  menu,
  categories,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const paramCategories = searchParams?.get('category')?.split(',') || []

    if (locale === 'en') {
      return paramCategories
    }

    return paramCategories
      .map((engCategory) =>
        Object.keys(categoryMap).find(
          (key) => categoryMap[key] === engCategory,
        ),
      )
      .filter(Boolean) as string[]
  })

  const handleToggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(updatedCategories)

    const englishCategories = updatedCategories
      .map((ukCategory) =>
        locale === 'en' ? ukCategory : categoryMap[ukCategory],
      )
      .filter(Boolean)

    const params = new URLSearchParams(searchParams?.toString())
    if (englishCategories.length > 0) {
      params.set('category', englishCategories.join(','))
    } else {
      params.delete('category')
    }

    const newPath = `/${locale}/${menu}?${params.toString()}`
    router.push(newPath)
  }

  return (
    <div className="relative z-0 w-full max-w-none grow">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger
            className={`flex w-full items-center justify-between gap-2.5 bg-[#0F0F0F] p-4 text-4xl text-[#FBFBFB]`}
          >
            Вид
          </AccordionTrigger>
          <AccordionContent className="relative z-0 flex flex-col">
            {categories && categories.length > 0 ? (
              categories.map((category: string, index: number) => (
                <div
                  className="relative z-0 flex items-center gap-6"
                  key={index}
                >
                  <CheckboxPrimitive.Root
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleToggleCategory(category)}
                    className="relative z-0 py-3"
                  >
                    <CheckboxRoot />
                    <CheckboxPrimitive.Indicator>
                      <CheckboxIndicator />
                    </CheckboxPrimitive.Indicator>
                  </CheckboxPrimitive.Root>
                  <label htmlFor={category} className="text-xl">
                    {category.toUpperCase()}
                  </label>
                </div>
              ))
            ) : (
              <div>No categories available.</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger
            className={`flex w-full items-center justify-between gap-2.5 bg-[#0F0F0F] p-4 text-4xl text-[#FBFBFB]`}
          >
            Вага
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-center text-xl">MultiRangeSlider</div>
            <div className="flex items-center justify-between text-xl">
              <div>Від 30 г</div>
              <div>До 150 г</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ProductSidebar
