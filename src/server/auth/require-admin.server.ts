import { getServerSession } from 'next-auth'

import {
  ADMIN_ROLES,
  hasAdminPermission,
  isAdminRole,
  type AdminPermission,
  type AdminRole,
  type UserRole,
} from '@/constants/user-role'
import { ApiError } from '@/server/api-error.server'
import { authOptions } from '@/server/auth/auth-options.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'

export interface AdminIdentity {
  id: string
  name: string
  email: string
  role: AdminRole
}

interface SuperAdminIdentity extends Omit<AdminIdentity, 'role'> {
  role: 'super-admin'
}

interface AdminDocument {
  _id: { toString(): string }
  username: string
  email: string
  role: UserRole
}

export async function requireAdmin(): Promise<AdminIdentity> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.trim().toLowerCase()

  if (!email) {
    throw new ApiError(401, 'Authentication required')
  }

  await connectToDbServer()

  const user = await UserSlice.findOne({
    email,
    role: { $in: ADMIN_ROLES },
    archivedAt: null,
  })
    .select('_id username email role')
    .lean<AdminDocument | null>()

  if (!user || !isAdminRole(user.role)) {
    throw new ApiError(403, 'Administrator access required')
  }

  return {
    id: user._id.toString(),
    name: user.username,
    email: user.email,
    role: user.role,
  }
}

export async function requireSuperAdmin(): Promise<SuperAdminIdentity> {
  const identity = await requireAdmin()

  if (identity.role !== 'super-admin') {
    throw new ApiError(403, 'Super administrator access required')
  }

  return { ...identity, role: 'super-admin' }
}

export async function requirePermission(
  permission: AdminPermission,
): Promise<AdminIdentity> {
  const identity = await requireAdmin()

  if (!hasAdminPermission(identity.role, permission)) {
    throw new ApiError(403, 'Insufficient administrator permissions')
  }

  return identity
}
