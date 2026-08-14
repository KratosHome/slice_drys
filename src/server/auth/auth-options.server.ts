import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { loginUser } from '@/server/auth/login.server'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const result = await loginUser(credentials.email, credentials.password)

        return result.success ? result.user : null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}
