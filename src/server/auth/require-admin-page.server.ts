import 'server-only'

import { redirect } from 'next/navigation'

import { hasAdminPermission, type AdminPermission } from '@/constants/user-role'
import { ApiError } from '@/server/api-error.server'
import {
  requireAdmin,
  type AdminIdentity,
} from '@/server/auth/require-admin.server'

export async function requireAdminPagePermission(
  locale: string,
  permission: AdminPermission,
): Promise<AdminIdentity | null> {
  let identity: AdminIdentity

  try {
    identity = await requireAdmin()
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      return null
    }

    throw error
  }

  if (!hasAdminPermission(identity.role, permission)) {
    redirect(`/${locale}/admin/new`)
  }

  return identity
}
