import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean)
  const requestedLocale = segments[0]?.toLowerCase()
  const hasLocale = routing.locales.includes(requestedLocale as ILocale)
  const isUnprefixedPublicRoute =
    !hasLocale && segments[0]?.toLowerCase() !== 'admin'
  const isPublicLocalizedRoute =
    hasLocale && segments[1]?.toLowerCase() !== 'admin'
  const normalizedPathname = request.nextUrl.pathname.toLowerCase()

  if (
    isUnprefixedPublicRoute &&
    request.nextUrl.pathname !== normalizedPathname
  ) {
    const normalizedUrl = request.nextUrl.clone()
    normalizedUrl.pathname = `/${routing.defaultLocale}${normalizedPathname}`
    return NextResponse.redirect(normalizedUrl, 308)
  }

  if (
    isPublicLocalizedRoute &&
    request.nextUrl.pathname !== normalizedPathname
  ) {
    const normalizedUrl = request.nextUrl.clone()
    normalizedUrl.pathname = normalizedPathname
    return NextResponse.redirect(normalizedUrl, 308)
  }

  return createMiddleware(routing)(request)
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
