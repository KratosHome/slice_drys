import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const isTesting = process.env.NEXT_STATUS === 'test'
const USERNAME = '1'
const PASSWORD = '1'

const ADMIN_USERNAME = 2
const ADMIN_PASSWORD = 2

export async function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')
  const { pathname } = request.nextUrl
  const adminRegex = /^\/((en|uk)\/)?admin(\/|$)/

  if (isTesting) {
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

  if (adminRegex.test(pathname)) {
    if (
      !auth ||
      auth !==
        `Basic ${Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64')}`
    ) {
      return new Response('Admin authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Protected"',
        },
      })
    }
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/', '/(en|uk)/:path*'],
}
