import NextAuth from 'next-auth'

import { authOptions } from '@/server/auth/auth-options.server'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
