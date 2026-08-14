import type { UserRole } from '@/constants/user-role'
import { requireSuperAdmin } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'
import type { AdminUserListItem } from '@/types/admin-user'

interface AdminUserDocument {
  _id: { toString(): string }
  username: string
  email: string
  role: UserRole
}

function getFullName(username: string, email: string): string | null {
  const normalizedName = username.trim()

  if (!normalizedName || normalizedName.toLowerCase() === email.toLowerCase()) {
    return null
  }

  return normalizedName
}

export async function getActiveAdminUsers(): Promise<AdminUserListItem[]> {
  const identity = await requireSuperAdmin()

  await connectToDbServer()

  const users = await UserSlice.find({ archivedAt: null })
    .select('_id username email role')
    .sort({ username: 1, email: 1, _id: 1 })
    .collation({ locale: 'uk', strength: 2 })
    .lean<AdminUserDocument[]>()

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    fullName: getFullName(user.username, user.email),
    role: user.role,
    isCurrentUser: user._id.toString() === identity.id,
  }))
}
