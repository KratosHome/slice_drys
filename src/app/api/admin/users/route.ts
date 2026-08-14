import { isUserRole } from '@/constants/user-role'
import { ApiError } from '@/server/api-error.server'
import { apiErrorResponse, noStoreJson } from '@/server/api-response.server'
import { createUserBySuperAdmin } from '@/server/auth/create-user.server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'Тіло запиту має бути коректним JSON')
    }

    if (typeof body !== 'object' || body === null) {
      throw new ApiError(400, 'Некоректні дані користувача')
    }

    const login = 'login' in body ? body.login : undefined
    const password = 'password' in body ? body.password : undefined
    const role = 'role' in body ? body.role : undefined

    if (
      typeof login !== 'string' ||
      typeof password !== 'string' ||
      !isUserRole(role)
    ) {
      throw new ApiError(400, 'Некоректні дані користувача')
    }

    const user = await createUserBySuperAdmin({ login, password, role })

    return noStoreJson(
      {
        success: true as const,
        data: user,
      },
      { status: 201 },
    )
  } catch (error) {
    return apiErrorResponse(error)
  }
}
