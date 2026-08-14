export const USER_ROLES = [
  'client',
  'manager',
  'developer',
  'super-admin',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export const ADMIN_ROLES = ['manager', 'developer', 'super-admin'] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  client: 'Користувач',
  manager: 'Менеджер',
  developer: 'Розробник',
  'super-admin': 'Адмін (суперадмін)',
}

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  client: 'Не має доступу до адмінпанелі.',
  manager: 'Має доступ до робочих розділів адмінпанелі.',
  developer: 'Має доступ до адмінпанелі для технічної роботи.',
  'super-admin': 'Має повний доступ і може створювати користувачів.',
}

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (USER_ROLES as readonly string[]).includes(value)
  )
}

export function isAdminRole(value: unknown): value is AdminRole {
  return (
    isUserRole(value) && (ADMIN_ROLES as readonly UserRole[]).includes(value)
  )
}
