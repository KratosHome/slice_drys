'use client'
import React, { FC, useState } from 'react'
import CategoryNode from '@/components/admin/categories/category-node'
import UpdateTree from '@/components/admin/categories/update-tree'

interface CategoriesTreeProps {
  categories: ICategory[]
}

const CategoriesTree: FC<CategoriesTreeProps> = ({ categories }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  )

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  console.log(categories)
  return (
    <div className="flex flex-col gap-6 p-6 md:flex-row">
      <div className="w-full rounded-lg border bg-white p-4 shadow md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold">Категорії</h2>
        <ul>
          {categories.map((category) => (
            <CategoryNode
              key={category._id}
              category={category}
              expanded={expanded}
              toggleExpand={toggleExpand}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </ul>
      </div>

      <div className="w-full rounded-lg border bg-white p-4 shadow md:w-2/3">
        <h2 className="mb-4 text-lg font-semibold">Інформація</h2>
        {selectedCategory ? (
          <UpdateTree selectedCategory={selectedCategory} />
        ) : (
          <p className="text-gray-500">
            Оберіть категорію для перегляду інформації
          </p>
        )}
      </div>
    </div>
  )
}

export default CategoriesTree
