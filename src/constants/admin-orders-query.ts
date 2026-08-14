export const ADMIN_ORDER_PAGE_SIZES = [10, 20, 50] as const
const ADMIN_ORDER_SORT_FIELDS = ['createdAt', 'customer', 'total'] as const
const ADMIN_ORDER_SORT_DIRECTIONS = ['asc', 'desc'] as const

export type AdminOrderPageSize = (typeof ADMIN_ORDER_PAGE_SIZES)[number]
export type AdminOrderSortField = (typeof ADMIN_ORDER_SORT_FIELDS)[number]
export type AdminOrderSortDirection =
  (typeof ADMIN_ORDER_SORT_DIRECTIONS)[number]

export interface AdminOrdersQueryState {
  page: number
  pageSize: AdminOrderPageSize
  search: string
  sort: AdminOrderSortField
  order: AdminOrderSortDirection
}

export const DEFAULT_ADMIN_ORDERS_QUERY: AdminOrdersQueryState = {
  page: 1,
  pageSize: 10,
  search: '',
  sort: 'createdAt',
  order: 'desc',
}

const MAX_PAGE = 100_000
const MAX_SEARCH_LENGTH = 100

type QueryReader = (
  name: keyof AdminOrdersQueryState,
) => string | null | undefined

export function isAdminOrderSortField(
  value: unknown,
): value is AdminOrderSortField {
  return (
    typeof value === 'string' &&
    ADMIN_ORDER_SORT_FIELDS.includes(value as AdminOrderSortField)
  )
}

export function isAdminOrderSortDirection(
  value: unknown,
): value is AdminOrderSortDirection {
  return (
    typeof value === 'string' &&
    ADMIN_ORDER_SORT_DIRECTIONS.includes(value as AdminOrderSortDirection)
  )
}

export function parseAdminOrdersQuery(
  read: QueryReader,
): AdminOrdersQueryState {
  const rawPage = Number(read('page'))
  const rawPageSize = Number(read('pageSize'))
  const rawSort = read('sort')
  const rawOrder = read('order')
  const page = Number.isInteger(rawPage)
    ? Math.min(Math.max(rawPage, 1), MAX_PAGE)
    : DEFAULT_ADMIN_ORDERS_QUERY.page
  const pageSize = ADMIN_ORDER_PAGE_SIZES.includes(
    rawPageSize as AdminOrderPageSize,
  )
    ? (rawPageSize as AdminOrderPageSize)
    : DEFAULT_ADMIN_ORDERS_QUERY.pageSize

  return {
    page,
    pageSize,
    search: (read('search') ?? '').trim().slice(0, MAX_SEARCH_LENGTH),
    sort: isAdminOrderSortField(rawSort)
      ? rawSort
      : DEFAULT_ADMIN_ORDERS_QUERY.sort,
    order: isAdminOrderSortDirection(rawOrder)
      ? rawOrder
      : DEFAULT_ADMIN_ORDERS_QUERY.order,
  }
}

export function buildAdminOrdersSearchParams(
  current: URLSearchParams,
  state: AdminOrdersQueryState,
): URLSearchParams {
  const params = new URLSearchParams(current.toString())

  if (state.page === DEFAULT_ADMIN_ORDERS_QUERY.page) params.delete('page')
  else params.set('page', String(state.page))

  if (state.pageSize === DEFAULT_ADMIN_ORDERS_QUERY.pageSize) {
    params.delete('pageSize')
  } else {
    params.set('pageSize', String(state.pageSize))
  }

  if (state.search) params.set('search', state.search)
  else params.delete('search')

  if (state.sort === DEFAULT_ADMIN_ORDERS_QUERY.sort) params.delete('sort')
  else params.set('sort', state.sort)

  if (state.order === DEFAULT_ADMIN_ORDERS_QUERY.order) params.delete('order')
  else params.set('order', state.order)

  return params
}

export function areAdminOrdersQueriesEqual(
  left: AdminOrdersQueryState,
  right: AdminOrdersQueryState,
): boolean {
  return (
    left.page === right.page &&
    left.pageSize === right.pageSize &&
    left.search === right.search &&
    left.sort === right.sort &&
    left.order === right.order
  )
}
