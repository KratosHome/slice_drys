'use server'
import bcrypt from 'bcrypt'

import type { UserRole } from '@/constants/user-role'
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

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  'use server'

  const normalizedEmail = email.trim().toLowerCase()

  if (
    !normalizedEmail ||
    normalizedEmail.length > 150 ||
    !password ||
    password.length > 256
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
      archivedAt: null,
    })
      .select('_id username email role +password')
      .lean<UserCredentialsDocument | null>()

    if (!user || typeof user.password !== 'string') {
      return {
        success: false,
        message: INVALID_CREDENTIALS_MESSAGE,
        user: null,
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
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
