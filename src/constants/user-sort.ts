export type UserSort = 'type-asc' | 'type-desc'

export function getUserSort(value: unknown): UserSort {
  return value === 'type-desc' ? 'type-desc' : 'type-asc'
}
