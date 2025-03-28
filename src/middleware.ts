import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const USERNAME = process.env.NEXT_ADMIN_LOGIN
const PASSWORD = process.env.NEXT_ADMIN_PASS

export async function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')
  const { pathname } = request.nextUrl
  const adminRegex = /^\/((en|uk)\/)?admin(\/|$)/

  if (adminRegex.test(pathname)) {
    if (
      !auth ||
      auth !==
        `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')}`
    ) {
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Protected"',
        },
      })
    }
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/', '/(en|uk)/:path*'],
}
