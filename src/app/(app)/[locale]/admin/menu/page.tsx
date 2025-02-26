import { getMenus } from '@/server/menu/get-menus.server'
import { getCategories } from '@/server/categories/get-categories.server'
import { ICategory } from '@/types/ICategory'
import { Tabs, TabsList, TabsTrigger } from '@/components/admin/ui/tabs'
import MenuCategorySelect from '@/components/admin/menu/menu-category-select'

export default async function Menu(props: {
  params: Params
  searchParams: ISearchParams
}) {
  const { locale } = await props.params

  const dataMenu: IResult<IMenu> = await getMenus(locale)
  const dataCategory: IResult<ICategory> = await getCategories(locale)

  return (
    <Tabs defaultValue={dataMenu.data[0]?.slug || ''} className="px-5 py-4">
      <TabsList>
        {dataMenu.data.map((menu) => (
          <TabsTrigger key={menu.slug} value={menu.slug}>
            {menu.name['en'] ?? 'Unknown'}
          </TabsTrigger>
        ))}
      </TabsList>

      {dataMenu.data.map((menu) => (
        <MenuCategorySelect
          key={menu.slug}
          menu={menu}
          categories={dataCategory.data}
        />
      ))}
    </Tabs>
  )
}
