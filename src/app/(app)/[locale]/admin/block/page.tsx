import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/admin/ui/tabs'
import HelpMainPage from '@/components/admin/block/help-main-page'
import { getHelpMain } from '@/server/block/get-help-main.server'

type Params = Promise<{ locale: ILocale }>

export default async function MenuPage(props: { params: Params }) {
  const { locale } = await props.params

  const helpData = await getHelpMain(locale, false)

  return (
    <div className="px-5">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="help_main_block">
            Головна, блок допомоги
          </TabsTrigger>
          <TabsTrigger value="partners">Головна партнери</TabsTrigger>
          <TabsTrigger value="Instagram">Instagram</TabsTrigger>
          <TabsTrigger value="FAQ">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="partners">
          Ще в розробці, скажіть якщо треба в першу чергу
        </TabsContent>
        <TabsContent value="Instagram">
          Ще в розробці, скажіть якщо треба в першу чергу
        </TabsContent>
        <TabsContent value="FAQ">
          Ще в розробці, скажіть якщо треба в першу чергу
        </TabsContent>
        <TabsContent value="help_main_block">
          <HelpMainPage data={helpData.data as IHelp} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
