import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { loginUser } from '@/server/auth/login.server'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const result = await loginUser(
            credentials.email,
            credentials.password,
          )

          if (result.success) {
            return result.user
          }

          return null
        } catch {
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
