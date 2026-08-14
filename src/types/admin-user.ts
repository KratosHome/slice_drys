import type { UserRole } from '@/constants/user-role'

export interface AdminUserListItem {
  id: string
  email: string
  fullName: string | null
  role: UserRole
  isCurrentUser: boolean
}

export type ArchiveAdminUserResult =
  | { success: true; userId: string }
  | { success: false; message: string }
