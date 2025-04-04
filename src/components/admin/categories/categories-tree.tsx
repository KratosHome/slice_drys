'use client'
import React, { FC, useEffect, useState } from 'react'
import CategoryNode from '@/components/admin/categories/category-node'
import UpdateTree from '@/components/admin/categories/update-tree'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { changePosition } from '@/server/categories/change-position.server'

interface CategoriesTreeProps {
  categories: ICategory[]
}

const CategoriesTree: FC<CategoriesTreeProps> = ({ categories }) => {
  const [orderedCategories, setOrderedCategories] = useState(categories)
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  )

  useEffect(() => {
    setOrderedCategories(categories)
  }, [categories])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = orderedCategories.findIndex((c) => c._id === active.id)
    const newIndex = orderedCategories.findIndex((c) => c._id === over.id)

    const newOrder = arrayMove(orderedCategories, oldIndex, newIndex)

    setOrderedCategories(newOrder)

    await changePosition(
      newOrder.map((cat, index) => ({ ...cat, order: index })),
    )
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:flex-row">
      <div className="w-full rounded-lg border bg-white p-4 shadow-sm md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold">Категорії</h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedCategories.map((cat) => cat._id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="list">
              {orderedCategories.map((category) => (
                <CategoryNode
                  key={category._id}
                  category={category}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  setSelectedCategory={setSelectedCategory}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      <div className="w-full rounded-lg border bg-white p-4 shadow-sm md:w-2/3">
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
