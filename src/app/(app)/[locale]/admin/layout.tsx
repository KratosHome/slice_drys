import type { ReactNode } from 'react'

import { AppSidebar } from '@/components/admin/app-sidebar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

interface IAdminLayoutProps {
  children: ReactNode
  params: Promise<{ locale: LanguageType }>
}

export default async function AdminLayout(props: IAdminLayoutProps) {
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
