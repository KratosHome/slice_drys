'use client'
import React, { useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/admin/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'
import { ICategory } from '@/types/ICategory'

const MenuCategorySelect = ({
  menu,
  categories,
}: {
  menu: IMenu
  categories: ICategory[]
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    menu.categories?.[0]?._id.toString() || '',
  )

  return (
    <>
      <TabsContent key={menu.slug} value={menu.slug}>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Виберіть категорію" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id.toString()}>
                {category.name['en'] ?? category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TabsContent>
    </>
  )
}

export default MenuCategorySelect
