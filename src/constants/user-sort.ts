export const USER_SORT_VALUES = ['type-asc', 'type-desc'] as const

export type UserSort = (typeof USER_SORT_VALUES)[number]

export function getUserSort(value: unknown): UserSort {
  return value === 'type-desc' ? 'type-desc' : 'type-asc'
}
