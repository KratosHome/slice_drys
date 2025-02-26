import { getMenus } from '@/server/menu/get-menus.server'
import { getCategories } from '@/server/categories/get-categories.server'
import { Tabs, TabsList, TabsTrigger } from '@/components/admin/ui/tabs'
import MenuCategorySelect from '@/components/admin/menu/menu-category-select'
import MenuCreate from '@/components/admin/menu/menu-create'

export default async function Menu() {
  const dataMenu: IResult<IMenu> = await getMenus()
  const dataCategory: IResult<ICategory> = await getCategories()

  return (
    <>
      <MenuCreate categories={dataCategory.data} />
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
    </>
  )
}
