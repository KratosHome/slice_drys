import { getCategories } from '@/server/categories/get-categories.server'
import dynamic from 'next/dynamic'

const CategoriesTree = dynamic(
  () => import('@/components/admin/categories/categories-tree'),
)
const CreateCategories = dynamic(
  () => import('@/components/admin/categories/create-categories'),
)

export default async function Categories() {
  const dataCategories = await getCategories()

  return (
    <div className="px-5">
      <CreateCategories categories={dataCategories.data} />
      <CategoriesTree categories={dataCategories.data} />
    </div>
  )
}
