import React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { rubikDoodleShadow } from '@/fonts/fonts'
import CheckboxRoot from '@/components/ui/checkbox-root'
import CheckboxIndicator from '@/components/ui/checkbox-indicatir'

interface ProductSidebarProps {
  categories: string[]
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ categories }) => {
  return (
    <div className="relative z-0 w-full max-w-none grow">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger
            className={`${rubikDoodleShadow.className} flex w-full items-center justify-between gap-2.5 bg-[#0F0F0F] p-4 text-4xl text-[#FBFBFB]`}
          >
            Вид
          </AccordionTrigger>
          <div className="relative z-0 flex flex-col">
            {categories && categories.length > 0 ? (
              categories.map((category: string, index: number) => (
                <AccordionContent
                  className="relative z-0 flex items-center gap-6 pl-5"
                  key={index}
                >
                  <CheckboxPrimitive.Root
                    id={category}
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
                </AccordionContent>
              ))
            ) : (
              <AccordionContent>No categories available.</AccordionContent>
            )}
          </div>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger
            className={`${rubikDoodleShadow.className} flex w-full items-center justify-between gap-2.5 bg-[#0F0F0F] p-4 text-4xl text-[#FBFBFB]`}
          >
            Вага
          </AccordionTrigger>
          <AccordionContent className="py-[60px] text-center text-xl">
            MultiRangeSlider
          </AccordionContent>
          <AccordionContent className="flex items-center justify-between text-xl">
            <div>Від 30 г</div>
            <div>До 150 г</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ProductSidebar
