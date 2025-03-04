import React, { FC } from 'react'

interface CategoriesTreeProps {
  category: ICategory
  expanded: { [key: string]: boolean }
  toggleExpand: (id: string) => void
  setSelectedCategory: (category: ICategory) => void
}

const CategoryNode: FC<CategoriesTreeProps> = ({
  category,
  expanded,
  toggleExpand,
  setSelectedCategory,
}) => {
  return (
    <li className="mb-2">
      <div
        className="flex cursor-pointer items-center justify-between rounded bg-gray-100 p-2 hover:bg-gray-200"
        onClick={() => setSelectedCategory(category)}
      >
        <span>{category.name.uk}</span>
        {category.children && category.children.length > 0 && (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand(category._id)
            }}
          >
            {expanded[category._id] ? '−' : '+'}
          </button>
        )}
      </div>
      {expanded[category._id] && category.children && (
        <ul className="ml-4 mt-2 border-l border-gray-300 pl-2">
          {category.children.map((child) => (
            <CategoryNode
              key={child._id}
              category={child}
              expanded={expanded}
              toggleExpand={toggleExpand}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default CategoryNode
