import { getServerSession } from 'next-auth'

import { ApiError } from '@/server/api-error.server'
import { authOptions } from '@/server/auth/auth-options.server'
import type { UserRole } from '@/server/auth/login.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'

export const ADMIN_ROLES = ['super-admin', 'manager'] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]

export interface AdminIdentity {
  id: string
  name: string
  email: string
  role: AdminRole
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
  })
    .select('_id username email role')
    .lean<AdminDocument | null>()

  if (!user || !ADMIN_ROLES.includes(user.role as AdminRole)) {
    throw new ApiError(403, 'Administrator access required')
  }

  return {
    id: user._id.toString(),
    name: user.username,
    email: user.email,
    role: user.role as AdminRole,
  }
}
