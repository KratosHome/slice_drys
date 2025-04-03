import React, { FC } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface ICategoryTreeProps {
  categories: ICategory[]
  selectedCategories: string[]
  onCategoryChange: (categoryId: string, checked: boolean) => void
}

const CategoryTreeCheckbox = ({
  categories,
  selectedCategories,
  onCategoryChange,
}: ICategoryTreeProps) => {
  return (
    <ul className="ml-4 space-y-2 overflow-auto">
      {categories.map(({ _id, children, name }) => (
        <li key={_id} className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={_id}
              checked={selectedCategories.includes(_id)}
              onCheckedChange={(checked) => onCategoryChange(_id, !!checked)}
            />

            <label htmlFor={_id}>{name.uk}</label>
          </div>

          {children.length > 0 && (
            <CategoryTreeCheckbox
              categories={children}
              selectedCategories={selectedCategories}
              onCategoryChange={onCategoryChange}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

export default CategoryTreeCheckbox
