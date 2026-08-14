import { NextResponse } from 'next/server'

import { ApiError } from '@/server/api-error.server'

const NO_STORE_CACHE_CONTROL = 'private, no-store, max-age=0'

export function noStoreJson<T>(body: T, init?: ResponseInit): NextResponse<T> {
  const headers = new Headers(init?.headers)
  headers.set('Cache-Control', NO_STORE_CACHE_CONTROL)

  return NextResponse.json(body, {
    ...init,
    headers,
  })
}

export function apiErrorResponse(error: unknown): NextResponse<{
  success: false
  message: string
}> {
  if (error instanceof ApiError) {
    return noStoreJson(
      { success: false, message: error.message },
      { status: error.statusCode },
    )
  }

  console.error('Orders API request failed', error)

  return noStoreJson(
    { success: false, message: 'Internal server error' },
    { status: 500 },
  )
}
