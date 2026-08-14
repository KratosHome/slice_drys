import type { Metadata } from 'next'

import RegisterForm from '@/components/admin/register-user/register-user'
import UsersTable from '@/components/admin/register-user/users-table'
import {
  USER_ROLES,
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
} from '@/constants/user-role'
import { getUserSort } from '@/constants/user-sort'
import { ApiError } from '@/server/api-error.server'
import {
  requireAdmin,
  type AdminIdentity,
} from '@/server/auth/require-admin.server'
import { getActiveAdminUsers } from '@/server/user/get-admin-users.server'

export const metadata: Metadata = {
  title: 'Користувачі | Адмін панель',
}

interface UsersPageProps {
  searchParams: Promise<{ userSort?: string | string[] }>
}

async function getAdminIdentity(): Promise<AdminIdentity | null> {
  try {
    return await requireAdmin()
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      return null
    }

    throw error
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const identity = await getAdminIdentity()

  if (!identity) return null

  if (identity.role !== 'super-admin') {
    return (
      <section className="px-5 py-6">
        <div className="border-border bg-card max-w-xl rounded-xl border p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Користувачі</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Створювати нові облікові записи може лише суперадміністратор.
          </p>
        </div>
      </section>
    )
  }

  const [users, resolvedSearchParams] = await Promise.all([
    getActiveAdminUsers(),
    searchParams,
  ])
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
