'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { UserSlice } from '@/server/user/user-schema.server'
import bcrypt from 'bcrypt'

interface ICreateUser {
  name: string
  email: string
  password: string
}

export const createUsers = async (user: ICreateUser) => {
  'use server'
  try {
    await connectToDbServer()
    const isUser = await UserSlice.findOne({
      email: user.email.toLowerCase(),
    })

    if (!isUser) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(user.password, salt)

      const newUser = new UserSlice({
        username: user.name,
        email: user.email.toLowerCase(),
        password: hashedPassword,
        role: 'client',
      })

      await newUser.save()
      return { success: true }
    }
  } catch (err) {
    return { success: false, message: err }
  }
}
