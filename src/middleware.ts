import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const USERNAME = '1'
const PASSWORD = '1'

const ADMIN_USERNAME = process.env.NEXT_ADMIN_LOGIN
const ADMIN_PASSWORD = process.env.NEXT_ADMIN_PASS

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')
  const { pathname } = request.nextUrl
  const adminRegex = /^\/((en|uk)\/)?admin(\/|$)/

  if (adminRegex.test(pathname)) {
    const expectedAdminAuth = `Basic ${Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64')}` // Використано правильний синтаксис шаблонних рядків
    if (auth !== expectedAdminAuth) {
      return new Response('Admin authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Protected"' },
      })
    }
  } else {
    const expectedAuth = `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')}` // Використано правильний синтаксис шаблонних рядків
    if (auth !== expectedAuth) {
      return new Response('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
      })
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(en|uk)/:path*'],
}
