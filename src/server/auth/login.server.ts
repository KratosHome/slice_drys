'use server'
import bcrypt from 'bcrypt'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'

export const loginUser = async (email: string, password: string) => {
  'use server'
  try {
    await connectToDbServer()
    const user = await UserSlice.findOne({ email: email }).select('-resume')

    if (!user) return { success: false, message: 'User not found' }

    const isPasswordCorrect = await bcrypt.compare(
      password as string,
      user.password,
    )

    if (!isPasswordCorrect) return { success: false, message: 'Wrong password' }
    return {
      success: true,
      user,
    }
  } catch (err) {
    return {
      success: false,
      message: err,
      user: null,
    }
  }
}
