import { AppSidebar } from '@/components/admin/app-sidebar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: LanguageType }>
}) {
  const { children } = props

  return (
    <div className="mx-auto max-w-[1248px]">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
