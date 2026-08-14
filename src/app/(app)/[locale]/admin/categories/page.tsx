import { getCategories } from '@/server/categories/get-categories.server'
import { requireAdminPagePermission } from '@/server/auth/require-admin-page.server'
import dynamic from 'next/dynamic'

const CategoriesTree = dynamic(
  () => import('@/components/admin/categories/categories-tree'),
)
const CreateCategories = dynamic(
  () => import('@/components/admin/categories/create-categories'),
)

interface CategoriesPageProps {
  params: Promise<{ locale: string }>
}

export default async function Categories({ params }: CategoriesPageProps) {
  const { locale } = await params
  const identity = await requireAdminPagePermission(locale, 'categories:manage')

  if (!identity) return null

  const dataCategories = await getCategories()

  return (
    <div className="px-5">
      <CreateCategories categories={dataCategories.data} />
      <CategoriesTree categories={dataCategories.data} />
    </div>
  )
}
