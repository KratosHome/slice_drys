import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { loginUser } from '@/server/auth/login.server'

const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60

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
  session: {
    strategy: 'jwt',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
