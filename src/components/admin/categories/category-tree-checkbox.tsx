import React, { FC } from 'react'
import { Checkbox } from '@/components/admin/ui/checkbox'

interface CategoryTreeProps {
  categories: ICategory[]
  selectedCategories: string[]
  onCategoryChange: (categoryId: string, checked: boolean) => void
}

const CategoryTreeCheckbox: FC<CategoryTreeProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
    <ul className="ml-4 space-y-2 overflow-auto">
      {categories.map((category) => (
        <li key={category._id} className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={category._id}
              checked={selectedCategories.includes(category._id)}
              onCheckedChange={(checked) =>
                onCategoryChange(category._id, !!checked)
              }
            />
            <label htmlFor={category._id}>{category.name.uk}</label>
          </div>
          {category.children.length > 0 && (
            <CategoryTreeCheckbox
              categories={category.children}
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
