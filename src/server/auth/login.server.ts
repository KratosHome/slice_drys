import 'server-only'

import bcrypt from 'bcrypt'

import { ADMIN_ROLES, isAdminRole, type UserRole } from '@/constants/user-role'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'

export type { UserRole } from '@/constants/user-role'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  role: UserRole
}

type LoginResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; message: string; user: null }

interface UserCredentialsDocument {
  _id: { toString(): string }
  username: string
  email: string
  password: string
  role: UserRole
}

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password'
const MAX_PASSWORD_BYTES = 72
const DUMMY_PASSWORD_HASH =
  '$2b$12$6MxfjML3cj29Ik8Fy13mS.a7pUs/k.O9zKaPeCs2GXmxqzRsAt73S'

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase()

  if (
    !normalizedEmail ||
    normalizedEmail.length > 150 ||
    !password ||
    Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES
  ) {
    return {
      success: false,
      message: INVALID_CREDENTIALS_MESSAGE,
      user: null,
    }
  }

  try {
    await connectToDbServer()
    const user = await UserSlice.findOne({
      email: normalizedEmail,
      role: { $in: ADMIN_ROLES },
      archivedAt: null,
    })
      .select('_id username email role +password')
      .lean<UserCredentialsDocument | null>()

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (
      !user ||
      typeof user.password !== 'string' ||
      !isAdminRole(user.role) ||
      !isPasswordCorrect
    ) {
      return {
        success: false,
        message: INVALID_CREDENTIALS_MESSAGE,
        user: null,
      }
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.username,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('Admin login failed', error)

    return {
      success: false,
      message: INVALID_CREDENTIALS_MESSAGE,
      user: null,
    }
  }
}
