import type { Metadata } from 'next'

import RegisterForm from '@/components/admin/register-user/register-user'
import UsersTable from '@/components/admin/register-user/users-table'
import {
  USER_ROLES,
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
} from '@/constants/user-role'
import { getUserSort } from '@/constants/user-sort'
import { requireAdminPagePermission } from '@/server/auth/require-admin-page.server'
import { getActiveAdminUsers } from '@/server/user/get-admin-users.server'

export const metadata: Metadata = {
  title: 'Користувачі | Адмін панель',
}

interface UsersPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ userSort?: string | string[] }>
}

export default async function UsersPage({
  params,
  searchParams,
}: UsersPageProps) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
  const identity = await requireAdminPagePermission(locale, 'users:manage')

  if (!identity) return null

  const users = await getActiveAdminUsers()
  const userSort = getUserSort(resolvedSearchParams.userSort)

  return (
    <section className="px-5 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Користувачі</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Створення облікових записів і керування доступом до системи.
        </p>
      </div>

      <div className="grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]">
        <div className="border-border bg-card rounded-xl border p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">Новий користувач</h2>
          <p className="text-muted-foreground mt-1 mb-6 text-sm">
            Усі поля обов’язкові. Логіном слугує email.
          </p>
          <RegisterForm />
        </div>

        <aside className="border-border bg-card rounded-xl border p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">Ролі та доступ</h2>
          <div className="mt-4 space-y-4">
            {USER_ROLES.map((role) => (
              <div key={role}>
                <h3 className="text-sm font-medium">
                  {USER_ROLE_LABELS[role]}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm leading-5">
                  {USER_ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <UsersTable users={users} initialSort={userSort} />
    </section>
  )
}
