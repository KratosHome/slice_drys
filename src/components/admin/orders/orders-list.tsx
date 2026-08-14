'use client'

import {
  keepPreviousData,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
} from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import OrderDetailsSheet from '@/components/admin/orders/order-details-sheet'
import OrderStatusSelect from '@/components/admin/orders/order-status-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ADMIN_ORDER_PAGE_SIZES,
  areAdminOrdersQueriesEqual,
  buildAdminOrdersSearchParams,
  parseAdminOrdersQuery,
  type AdminOrderPageSize,
  type AdminOrderSortDirection,
  type AdminOrderSortField,
  type AdminOrdersQueryState,
} from '@/constants/admin-orders-query'
import type { OrderStatus } from '@/constants/order-status'
import type {
  AdminOrder,
  AdminOrderDelivery,
  AdminOrderProduct,
  AdminOrdersErrorResponse,
  AdminOrdersListResponse,
} from '@/types/admin-order'
import { cn } from '@/utils/cn'
import { getPaginationRange } from '@/utils/get-pagination-range'

const AUTO_REFRESH_INTERVAL = 30_000

const paymentLabels: Record<string, string> = {
  card: 'Карткою',
  cash: 'Післяплата',
  COD: 'Післяплата (COD)',
}

interface OrdersListProps {
  status: OrderStatus
  initialData: AdminOrdersListResponse
  initialQuery: AdminOrdersQueryState
}

interface OrdersQueryKeyData extends AdminOrdersQueryState {
  status: OrderStatus
}

interface SortOption {
  value: `${AdminOrderSortField}:${AdminOrderSortDirection}`
  label: string
  sort: AdminOrderSortField
  order: AdminOrderSortDirection
}

const sortOptions: SortOption[] = [
  {
    value: 'createdAt:desc',
    label: 'Спочатку нові',
    sort: 'createdAt',
    order: 'desc',
  },
  {
    value: 'createdAt:asc',
    label: 'Спочатку старі',
    sort: 'createdAt',
    order: 'asc',
  },
  {
    value: 'customer:asc',
    label: 'ПІБ: А–Я',
    sort: 'customer',
    order: 'asc',
  },
  {
    value: 'customer:desc',
    label: 'ПІБ: Я–А',
    sort: 'customer',
    order: 'desc',
  },
  {
    value: 'total:desc',
    label: 'Сума: від більшої',
    sort: 'total',
    order: 'desc',
  },
  {
    value: 'total:asc',
    label: 'Сума: від меншої',
    sort: 'total',
    order: 'asc',
  },
]

const amountFormatter = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 2,
})

const formatCurrency = (value: number) => `${amountFormatter.format(value)} грн`

const formatAddress = (delivery: AdminOrderDelivery) => {
  if ('courier' in delivery) {
    return delivery.courier || 'Кур’єрська доставка'
  }

  return [delivery.city, delivery.department].filter(Boolean).join(', ') || '—'
}

async function fetchOrders({
  queryKey,
}: QueryFunctionContext<
  readonly ['admin', 'orders', 'list', OrdersQueryKeyData]
>): Promise<AdminOrdersListResponse> {
  const [, , , params] = queryKey
  const searchParams = new URLSearchParams({
    status: params.status,
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort,
    order: params.order,
  })

  if (params.search) searchParams.set('search', params.search)

  const response = await fetch(`/api/orders?${searchParams.toString()}`, {
    cache: 'no-store',
  })
  const payload = (await response.json()) as
    | AdminOrdersListResponse
    | AdminOrdersErrorResponse

  if (!response.ok || !payload.success) {
    throw new Error(
      'message' in payload
        ? payload.message
        : 'Не вдалося завантажити замовлення',
    )
  }

  return payload
}

function ProductsSummary({ products }: { products: AdminOrderProduct[] }) {
  if (!products.length) return <span className="text-muted-foreground">—</span>

  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-xs leading-5">
      {products.map((product, index) => (
        <span
          key={`${product.id}-${index}`}
          className="inline-flex min-w-0 items-baseline gap-1"
        >
          {index > 0 ? (
            <span className="text-muted-foreground/60" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="break-words">{product.name}</span>
          <span className="text-muted-foreground font-semibold whitespace-nowrap tabular-nums">
            ×{product.count}
          </span>
        </span>
      ))}
    </div>
  )
}

function OrdersSearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="ПІБ, email, телефон, адреса або коментар"
      className="bg-background pl-9 xl:max-w-xl"
    />
  )
}

function OrdersLoadingState() {
  return (
    <div className="space-y-3 p-4" aria-label="Завантаження замовлень">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  )
}

export default function OrdersList({
  status,
  initialData,
  initialQuery,
}: OrdersListProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ordersListRef = useRef<HTMLDivElement>(null)
  const pendingScrollPageRef = useRef<number | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const query = useMemo(
    () => parseAdminOrdersQuery((name) => searchParams.get(name)),
    [searchParams],
  )
  const updateQuery = useCallback(
    (
      patch: Partial<AdminOrdersQueryState>,
      historyMode: 'push' | 'replace' = 'push',
    ) => {
      const nextState: AdminOrdersQueryState = { ...query, ...patch }
      const params = buildAdminOrdersSearchParams(
        new URLSearchParams(searchParams.toString()),
        nextState,
      )
      const queryString = params.toString()
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname

      if (historyMode === 'replace') {
        window.history.replaceState(null, '', nextUrl)
      } else {
        window.history.pushState(null, '', nextUrl)
      }
    },
    [pathname, query, searchParams],
  )
  const updateSearch = useCallback(
    (value: string) => {
      updateQuery({ page: 1, search: value.trim().slice(0, 100) }, 'replace')
    },
    [updateQuery],
  )

  const [debouncedSearch] = useDebounce(query.search, 350)
  const requestQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [debouncedSearch, query],
  )
  const queryKey = [
    'admin',
    'orders',
    'list',
    { status, ...requestQuery },
  ] as const

  const shouldUseInitialData = areAdminOrdersQueriesEqual(
    requestQuery,
    initialQuery,
  )

  const ordersQuery = useQuery({
    queryKey,
    queryFn: fetchOrders,
    initialData: shouldUseInitialData ? initialData : undefined,
    placeholderData: keepPreviousData,
    refetchInterval: AUTO_REFRESH_INTERVAL,
    refetchIntervalInBackground: false,
  })

  const result = ordersQuery.data

  const scrollToOrdersList = useCallback(() => {
    ordersListRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }, [])

  useEffect(() => {
    const pendingPage = pendingScrollPageRef.current

    if (
      pendingPage === null ||
      ordersQuery.isFetching ||
      result?.pagination.page !== pendingPage
    ) {
      return
    }

    pendingScrollPageRef.current = null
    requestAnimationFrame(scrollToOrdersList)
  }, [ordersQuery.isFetching, result?.pagination.page, scrollToOrdersList])

  useEffect(() => {
    if (
      !result ||
      ordersQuery.isPlaceholderData ||
      result.pagination.page === query.page
    ) {
      return
    }

    updateQuery({ page: result.pagination.page }, 'replace')
  }, [ordersQuery.isPlaceholderData, query.page, result, updateQuery])

  const paginationRange = useMemo(
    () =>
      getPaginationRange(
        result?.pagination.page ?? query.page,
        result?.pagination.totalPages ?? 1,
      ),
    [query.page, result?.pagination.page, result?.pagination.totalPages],
  )

  const totalItems = result?.pagination.totalItems ?? 0
  const resultPage = result?.pagination.page ?? query.page
  const resultPageSize = result?.pagination.pageSize ?? query.pageSize
  const firstItem = totalItems ? (resultPage - 1) * resultPageSize + 1 : 0
  const lastItem = Math.min(resultPage * resultPageSize, totalItems)
  const selectedSortValue = `${query.sort}:${query.order}`
  const changePage = useCallback(
    (page: number) => {
      if (page === query.page) return

      pendingScrollPageRef.current = page
      updateQuery({ page })
    },
    [query.page, updateQuery],
  )

  return (
    <div
      ref={ordersListRef}
      className="border-border bg-card mt-6 w-full scroll-mt-24 rounded-xl border p-3 shadow-sm sm:p-4"
    >
      <div className="flex flex-col gap-3 pb-3 xl:flex-row xl:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">
            Пошук у замовленнях
          </span>
          <span className="relative block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <OrdersSearchField value={query.search} onChange={updateSearch} />
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Сортування
            </span>
            <Select
              value={selectedSortValue}
              onValueChange={(value) => {
                const option = sortOptions.find((item) => item.value === value)
                if (!option) return

                updateQuery({
                  page: 1,
                  sort: option.sort,
                  order: option.order,
                })
              }}
            >
              <SelectTrigger className="bg-background h-9 w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              На сторінці
            </span>
            <Select
              value={String(query.pageSize)}
              onValueChange={(value) => {
                updateQuery({
                  page: 1,
                  pageSize: Number(value) as AdminOrderPageSize,
                })
              }}
            >
              <SelectTrigger className="bg-background h-9 w-full sm:w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ORDER_PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
          >
            <RefreshCw
              className={cn('size-4', ordersQuery.isFetching && 'animate-spin')}
            />
            Оновити
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span aria-live="polite">
          {ordersQuery.isFetching
            ? 'Оновлюємо дані…'
            : 'Автооновлення кожні 30 секунд'}
        </span>
        {result ? (
          <span>
            Показано {firstItem}–{lastItem} з {totalItems}
          </span>
        ) : null}
      </div>

      <div className="border-border overflow-hidden rounded-lg border">
        {ordersQuery.isPending ? <OrdersLoadingState /> : null}

        {ordersQuery.isError && !result ? (
          <div
            role="alert"
            className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <AlertCircle className="text-destructive size-8" />
            <div>
              <p className="font-semibold">Не вдалося завантажити замовлення</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {ordersQuery.error.message}
              </p>
            </div>
            <Button variant="outline" onClick={() => ordersQuery.refetch()}>
              Спробувати ще раз
            </Button>
          </div>
        ) : null}

        {ordersQuery.isError && result ? (
          <div
            role="status"
            className="border-destructive/30 bg-destructive/5 text-destructive flex items-center gap-2 border-b px-3 py-2 text-sm"
          >
            <AlertCircle className="size-4 shrink-0" />
            Не вдалося оновити дані. Показуємо останню доступну версію.
          </div>
        ) : null}

        {result ? (
          <Table className="min-w-[1300px] table-fixed">
            <colgroup>
              <col style={{ width: 200 }} />
              <col style={{ width: 128 }} />
              <col style={{ width: 144 }} />
              <col style={{ width: 212 }} />
              <col style={{ width: 212 }} />
              <col style={{ width: 104 }} />
              <col style={{ width: 86 }} />
              <col style={{ width: 118 }} />
              <col style={{ width: 96 }} />
            </colgroup>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="h-9 px-2.5">Статус</TableHead>
                <TableHead className="h-9 px-2.5">ПІБ</TableHead>
                <TableHead className="h-9 px-2.5">Телефон</TableHead>
                <TableHead className="h-9 px-2.5">Товари</TableHead>
                <TableHead className="h-9 px-2.5">Адреса доставки</TableHead>
                <TableHead className="h-9 px-2.5">Спосіб оплати</TableHead>
                <TableHead className="h-9 px-2.5 text-right">Сума</TableHead>
                <TableHead className="h-9 px-2.5">Коментар</TableHead>
                <TableHead className="bg-muted/95 sticky right-0 h-9 px-2.5 text-right">
                  Деталі
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.length ? (
                result.data.map((order: AdminOrder) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-2.5 py-2.5 align-top">
                      <OrderStatusSelect order={order} />
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 align-top font-medium break-words">
                      {order.user.name} {order.user.surname}
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 align-top whitespace-nowrap">
                      <a
                        href={`tel:${order.user.phone}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {order.user.phone}
                      </a>
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 align-top whitespace-normal">
                      <ProductsSummary products={order.products} />
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 align-top whitespace-normal">
                      <p className="line-clamp-3 break-words">
                        {formatAddress(order.delivery)}
                      </p>
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 align-top whitespace-normal">
                      {paymentLabels[order.payment.method] ??
                        order.payment.method ??
                        '—'}
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 text-right align-top font-semibold whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="px-2.5 py-2.5 align-top whitespace-normal">
                      <p className="text-muted-foreground line-clamp-3 break-words">
                        {order.comment?.trim() || '—'}
                      </p>
                    </TableCell>
                    <TableCell className="bg-card sticky right-0 px-2.5 py-2.5 text-right align-top shadow-[-10px_0_16px_-16px_rgba(0,0,0,0.45)]">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrderId(order.id)}
                        aria-label={`Відкрити деталі замовлення ${order.user.name} ${order.user.surname}`}
                      >
                        <Eye className="size-4" />
                        Деталі
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-48 text-center whitespace-normal"
                  >
                    <div className="mx-auto max-w-md">
                      <p className="font-semibold">Замовлень не знайдено</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Змініть пошук або оберіть інший статус.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : null}
      </div>

      {result ? (
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-muted-foreground text-sm">
            Сторінка {result.pagination.page} з {result.pagination.totalPages}
          </div>

          <nav
            aria-label="Пагінація замовлень"
            className="flex flex-wrap items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                changePage(Math.max(1, result.pagination.page - 1))
              }
              disabled={!result.pagination.hasPreviousPage}
            >
              <ChevronLeft className="size-4" />
              Попередня
            </Button>

            {paginationRange.map((item, index) =>
              item === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="text-muted-foreground px-1"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  type="button"
                  variant={
                    item === result.pagination.page ? 'default' : 'outline'
                  }
                  size="icon"
                  className="size-9"
                  onClick={() => changePage(item)}
                  disabled={item === result.pagination.page}
                  aria-label={`Сторінка ${item}`}
                  aria-current={
                    item === result.pagination.page ? 'page' : undefined
                  }
                >
                  {item}
                </Button>
              ),
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => changePage(result.pagination.page + 1)}
              disabled={!result.pagination.hasNextPage}
            >
              Наступна
              <ChevronRight className="size-4" />
            </Button>
          </nav>
        </div>
      ) : null}

      <OrderDetailsSheet
        orderId={selectedOrderId}
        open={selectedOrderId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null)
        }}
      />
    </div>
  )
}
