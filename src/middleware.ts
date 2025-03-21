import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const isTesting = process.env.NEXT_STATUS === 'test'
const USERNAME = '1'
const PASSWORD = '1'

export async function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')

  if (isTesting) {
    const { pathname } = request.nextUrl
    const adminRegex = /^\/((en|uk)\/)?admin(\/|$)/

    if (adminRegex.test(pathname)) {
      return new Response('Access forbidden', { status: 403 })
    }

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
