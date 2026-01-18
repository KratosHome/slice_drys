import React, { FC } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li className="mb-2" ref={setNodeRef} style={style} {...attributes}>
      <div
        className="flex cursor-pointer items-center justify-between rounded bg-gray-100 p-2 hover:bg-gray-200"
        onClick={() => setSelectedCategory(category)}
      >
        {/* Додай окремий елемент для перетягування */}
        <span className="mr-2 cursor-move" {...listeners}>
          ⠿
        </span>

        <span className="flex-1">{category.name.uk}</span>

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
        <ul className="mt-2 ml-4 border-l border-gray-300 pl-2">
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
