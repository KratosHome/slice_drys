import { redirect } from 'next/navigation'

import { requireAdminPagePermission } from '@/server/auth/require-admin-page.server'

interface AdminPageProps {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params
  const identity = await requireAdminPagePermission(locale, 'orders:read')

  if (!identity) return null

  redirect(`/${locale}/admin/new`)
}
