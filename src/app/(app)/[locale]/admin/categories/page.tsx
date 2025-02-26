import { getCategories } from '@/server/categories/get-categories.server'
import CategoriesTree from '@/components/admin/categories/categories-tree'
import CreateCategories from '@/components/admin/categories/create-categories'

export default async function Categories() {
  const dataCategories = await getCategories()

  return (
    <div className="px-5">
      <CreateCategories />
      <CategoriesTree categories={dataCategories.data} />
    </div>
  )
}
