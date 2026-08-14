import type { ReactNode } from 'react'

import { AppSidebar } from '@/components/admin/app-sidebar/app-sidebar'
import Login from '@/components/admin/login/login'
import LogOut from '@/components/admin/log-out/log-out'
import AdminQueryProvider from '@/components/admin/query-provider/admin-query-provider'
import SessionProvider from '@/components/admin/session-provider/session-provider'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ApiError } from '@/server/api-error.server'
import { authOptions } from '@/server/auth/auth-options.server'
import { requireAdmin } from '@/server/auth/require-admin.server'
import { getServerSession } from 'next-auth'

interface IAdminLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: 'Адмін Панель',
  description: 'Адмін панель сайту. Сторінка недоступна для пошукових систем.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout(props: IAdminLayoutProps) {
  const { children } = props
  const session = await getServerSession(authOptions)
  let hasAdminAccess = false

  if (session?.user) {
    try {
      await requireAdmin()
      hasAdminAccess = true
    } catch (error) {
      if (
        !(error instanceof ApiError) ||
        (error.statusCode !== 401 && error.statusCode !== 403)
      ) {
        throw error
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <SessionProvider session={session}>
        <SidebarProvider>
          {!session || !session.user ? (
            <main className="w-full">
              <Login />
            </main>
          ) : !hasAdminAccess ? (
            <main className="flex min-h-80 w-full items-center justify-center px-4">
              <div className="border-border bg-card max-w-md rounded-xl border p-6 text-center shadow-sm">
                <h1 className="text-xl font-semibold">Доступ заборонено</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Цей розділ доступний лише менеджерам та адміністраторам.
                </p>
                <div className="mt-5 flex justify-center">
                  <LogOut />
                </div>
              </div>
            </main>
          ) : (
            <AdminQueryProvider>
              <AppSidebar />
              <main className="w-full min-w-0 pb-8">
                <SidebarTrigger />
                {children}
              </main>
            </AdminQueryProvider>
          )}
        </SidebarProvider>
      </SessionProvider>
    </div>
  )
}
