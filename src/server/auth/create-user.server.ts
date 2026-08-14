import bcrypt from 'bcrypt'

import { isUserRole, type UserRole } from '@/constants/user-role'
import { ApiError } from '@/server/api-error.server'
import { requireSuperAdmin } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_BYTES = 72
const MAX_LOGIN_LENGTH = 120

export interface CreateUserInput {
  login: string
  password: string
  role: UserRole
}

export interface CreatedUser {
  id: string
  login: string
  role: UserRole
}

interface CreatedUserDocument {
  _id: { toString(): string }
  email: string
  role: UserRole
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  )
}

export async function createUserBySuperAdmin(
  input: CreateUserInput,
): Promise<CreatedUser> {
  await requireSuperAdmin()

  const login = input.login.trim().toLowerCase()

  if (!login || login.length > MAX_LOGIN_LENGTH || !EMAIL_PATTERN.test(login)) {
    throw new ApiError(400, 'Вкажіть коректний email для логіна')
  }

  if (
    typeof input.password !== 'string' ||
    input.password.length < MIN_PASSWORD_LENGTH ||
    Buffer.byteLength(input.password, 'utf8') > MAX_PASSWORD_BYTES
  ) {
    throw new ApiError(
      400,
      `Пароль повинен містити щонайменше ${MIN_PASSWORD_LENGTH} символів і не перевищувати ${MAX_PASSWORD_BYTES} байти`,
    )
  }

  if (!isUserRole(input.role)) {
    throw new ApiError(400, 'Недопустима роль користувача')
  }

  await connectToDbServer()

  const existingUser = await UserSlice.exists({ email: login })

  if (existingUser) {
    throw new ApiError(409, 'Користувач із таким логіном уже існує')
  }

  const passwordHash = await bcrypt.hash(input.password, 12)

  try {
    const user = await UserSlice.create({
      username: login,
      email: login,
      password: passwordHash,
      role: input.role,
    })
    const safeUser = user.toObject() as CreatedUserDocument

    return {
      id: safeUser._id.toString(),
      login: safeUser.email,
      role: safeUser.role,
    }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(409, 'Користувач із таким логіном уже існує')
    }

    throw error
  }
}
