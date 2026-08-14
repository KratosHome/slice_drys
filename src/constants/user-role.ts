export const USER_ROLES = [
  'client',
  'manager',
  'developer',
  'super-admin',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export const ADMIN_ROLES = ['manager', 'super-admin'] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]

export const ADMIN_PERMISSIONS = [
  'orders:read',
  'orders:update-status',
  'statistics:read',
  'categories:manage',
  'products:manage',
  'blog:manage',
  'blocks:manage',
  'users:manage',
] as const

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number]

export const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  manager: ['orders:read', 'orders:update-status', 'statistics:read'],
  'super-admin': ADMIN_PERMISSIONS,
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  client: 'Користувач',
  manager: 'Менеджер',
  developer: 'Розробник',
  'super-admin': 'Адмін (суперадмін)',
}

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  client: 'Не має доступу до адмінпанелі.',
  manager: 'Має доступ до замовлень і статистики.',
  developer: 'Технічна роль без доступу до адмінпанелі.',
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

export function hasAdminPermission(
  role: AdminRole,
  permission: AdminPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}
