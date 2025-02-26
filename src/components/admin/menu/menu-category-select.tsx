'use client'
import React, { useState } from 'react'
import { TabsContent } from '@/components/admin/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'
import { ICategory } from '@/types/ICategory'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'

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
        <div>
          <Input className="mt-2" placeholder="slug" />
        </div>
        <div className="mt-2 flex gap-2">
          <Button>Save</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </TabsContent>
    </>
  )
}

export default MenuCategorySelect
