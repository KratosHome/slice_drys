'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'

import { ApiError } from '@/server/api-error.server'
import { requireSuperAdmin } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'
import type { ArchiveAdminUserResult } from '@/types/admin-user'

export async function archiveAdminUser(
  userId: string,
): Promise<ArchiveAdminUserResult> {
  try {
    const identity = await requireSuperAdmin()

    if (typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Некоректний ідентифікатор користувача')
    }

    if (identity.id === userId) {
      throw new ApiError(409, 'Не можна архівувати власний обліковий запис')
    }

    await connectToDbServer()

    const archivedUser = await UserSlice.findOneAndUpdate(
      { _id: userId, archivedAt: null },
      {
        $set: {
          archivedAt: new Date(),
          archivedBy: identity.id,
        },
      },
      { new: true, runValidators: true },
    )
      .select('_id')
      .lean<{ _id: { toString(): string } } | null>()

    if (!archivedUser) {
      const existingUser = await UserSlice.exists({ _id: userId })

      if (!existingUser) {
        throw new ApiError(404, 'Користувача не знайдено')
      }

      throw new ApiError(409, 'Користувача вже заархівовано')
    }

    revalidatePath('/[locale]/admin/clients', 'page')

    return { success: true, userId: archivedUser._id.toString() }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message }
    }

    console.error('Archive admin user failed', error)

    return {
      success: false,
      message: 'Не вдалося заархівувати користувача',
    }
  }
}
