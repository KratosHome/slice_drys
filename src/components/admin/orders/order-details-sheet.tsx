'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { Loader2, RefreshCw } from 'lucide-react'

import { ORDER_STATUSES, type OrderStatus } from '@/constants/order-status'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/useToast'
import type {
  AdminOrder,
  AdminOrderPaymentMethod,
  AdminOrderResponse,
  AdminOrdersErrorResponse,
  UpdateAdminOrderStatusInput,
} from '@/types/admin-order'

const ADMIN_ORDERS_QUERY_KEY = ['admin', 'orders'] as const

export const adminOrdersQueryKeys = {
  all: ADMIN_ORDERS_QUERY_KEY,
  detail: (orderId: string) =>
    [...ADMIN_ORDERS_QUERY_KEY, 'detail', orderId] as const,
}

const orderStatusLabels: Record<OrderStatus, string> = {
  new: 'Нове',
  awaitingPayment: 'Очікує оплати',
  awaitingShipment: 'Очікує відправки',
  shipped: 'Відправлено',
  completed: 'Виконано',
  awaitingReturn: 'Очікує повернення',
  cancelled: 'Скасовано',
  failedDelivery: 'Не доставлено',
}

const paymentMethodLabels: Record<AdminOrderPaymentMethod, string> = {
  cash: 'Готівка при отриманні',
  card: 'Оплата карткою',
  COD: 'Післяплата',
  unknown: 'Невідомий спосіб',
}

const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Kyiv',
})

export interface OrderDetailsSheetProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface StatusMutationVariables {
  orderId: string
  status: OrderStatus
}

function getErrorMessage(
  payload: AdminOrderResponse | AdminOrdersErrorResponse | null,
  fallback: string,
) {
  if (payload && !payload.success) return payload.message

  return fallback
}

async function requestOrder(
  orderId: string,
  init?: RequestInit,
): Promise<AdminOrder> {
  const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
    cache: 'no-store',
    credentials: 'same-origin',
    ...init,
  })

  const payload = (await response.json().catch(() => null)) as
    | AdminOrderResponse
    | AdminOrdersErrorResponse
    | null

  if (!response.ok || !payload?.success) {
    throw new Error(
      getErrorMessage(payload, 'Не вдалося завантажити замовлення'),
    )
  }

  return payload.data
}

function formatDate(value: string) {
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)} грн`
}

function formatValue(value?: string | null) {
  return value?.trim() || '—'
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

function DetailItem({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground mt-1 min-w-0 text-sm break-words">
        {children}
      </dd>
    </div>
  )
}

function DetailsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-foreground text-base font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-label="Завантаження деталей замовлення">
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Separator />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-14" />
        ))}
      </div>
      <Separator />
      <Skeleton className="h-40" />
    </div>
  )
}

function OrderDetails({
  order,
  statusMutation,
}: {
  order: AdminOrder
  statusMutation: UseMutationResult<AdminOrder, Error, StatusMutationVariables>
}) {
  const delivery = order.delivery
  const selectedStatus = statusMutation.isPending
    ? statusMutation.variables.status
    : order.status
  const fullName = `${order.user.name} ${order.user.surname}`.trim()

  return (
    <div className="space-y-6">
      <DetailsSection title="Замовлення">
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="ID" className="sm:col-span-2">
            <span className="font-mono text-xs break-all">{order.id}</span>
          </DetailItem>
          <DetailItem label="Створено">
            {formatDate(order.createdAt)}
          </DetailItem>
          <DetailItem label="Оновлено">
            {formatDate(order.updatedAt)}
          </DetailItem>
        </dl>

        <div className="space-y-2">
          <Label htmlFor={`order-status-${order.id}`}>Статус</Label>
          <div className="flex items-center gap-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                statusMutation.mutate({
                  orderId: order.id,
                  status: value as OrderStatus,
                })
              }
              disabled={statusMutation.isPending}
            >
              <SelectTrigger
                id={`order-status-${order.id}`}
                className="min-h-10 flex-1"
                aria-label="Змінити статус замовлення"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {orderStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statusMutation.isPending ? (
              <Loader2
                className="text-muted-foreground size-5 animate-spin"
                aria-label="Оновлення статусу"
              />
            ) : null}
          </div>
        </div>
      </DetailsSection>

      <Separator />

      <DetailsSection title="Клієнт">
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="ПІБ">{formatValue(fullName)}</DetailItem>
          <DetailItem label="ID клієнта">
            <span className="font-mono text-xs break-all">
              {formatValue(order.user.id)}
            </span>
          </DetailItem>
          <DetailItem label="Телефон">
            {order.user.phone ? (
              <a
                href={phoneHref(order.user.phone)}
                className="underline underline-offset-4"
              >
                {order.user.phone}
              </a>
            ) : (
              '—'
            )}
          </DetailItem>
          <DetailItem label="Email">
            {order.user.email ? (
              <a
                href={`mailto:${order.user.email}`}
                className="underline underline-offset-4"
              >
                {order.user.email}
              </a>
            ) : (
              '—'
            )}
          </DetailItem>
        </dl>
      </DetailsSection>

      <Separator />

      <DetailsSection title="Доставка">
        <dl className="grid gap-4 sm:grid-cols-2">
          {delivery.city !== undefined ? (
            <DetailItem label="Місто">{formatValue(delivery.city)}</DetailItem>
          ) : null}
          {delivery.department !== undefined ? (
            <DetailItem label="Відділення / адреса">
              {formatValue(delivery.department)}
            </DetailItem>
          ) : null}
          {delivery.courier !== undefined ? (
            <DetailItem label="Кур'єрська адреса">
              {formatValue(delivery.courier)}
            </DetailItem>
          ) : null}
          <DetailItem label="Телефон отримувача">
            {delivery.phone ? (
              <a
                href={phoneHref(delivery.phone)}
                className="underline underline-offset-4"
              >
                {delivery.phone}
              </a>
            ) : (
              '—'
            )}
          </DetailItem>
        </dl>
      </DetailsSection>

      <Separator />

      <DetailsSection title="Оплата та коментар">
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Спосіб оплати">
            {paymentMethodLabels[order.payment.method] ?? order.payment.method}
          </DetailItem>
          <DetailItem label="Сума">{formatCurrency(order.total)}</DetailItem>
          <DetailItem label="Коментар" className="sm:col-span-2">
            <span className="whitespace-pre-wrap">
              {formatValue(order.comment)}
            </span>
          </DetailItem>
        </dl>
      </DetailsSection>

      <Separator />

      <DetailsSection title={`Товари (${order.products.length})`}>
        {order.products.length ? (
          <div className="border-border overflow-hidden rounded-lg border">
            <Table className="min-w-[560px]">
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-right">Кількість</TableHead>
                  <TableHead className="text-right">Ціна</TableHead>
                  <TableHead className="text-right">Разом</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product, index) => (
                  <TableRow key={`${product.id}-${index}`}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-muted-foreground mt-1 font-mono text-xs break-all">
                        {product.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.count}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatCurrency(product.price * product.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-border bg-muted/30 flex justify-end gap-3 border-t px-4 py-3 font-semibold">
              <span>Загальна сума:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            У замовленні немає товарів.
          </p>
        )}
      </DetailsSection>
    </div>
  )
}

export function OrderDetailsSheet({
  orderId,
  open,
  onOpenChange,
}: OrderDetailsSheetProps) {
  const queryClient = useQueryClient()
  const detailQueryKey = adminOrdersQueryKeys.detail(orderId ?? '')

  const orderQuery = useQuery({
    queryKey: detailQueryKey,
    queryFn: ({ signal }) => {
      if (!orderId) throw new Error('Не вибрано замовлення')

      return requestOrder(orderId, { signal })
    },
    enabled: open && Boolean(orderId),
  })

  const statusMutation = useMutation<
    AdminOrder,
    Error,
    StatusMutationVariables
  >({
    mutationFn: ({ orderId: mutationOrderId, status }) => {
      const body: Pick<UpdateAdminOrderStatusInput, 'status'> = { status }

      return requestOrder(mutationOrderId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    },
    onSuccess: async (updatedOrder, { status }) => {
      queryClient.setQueryData(
        adminOrdersQueryKeys.detail(updatedOrder.id),
        updatedOrder,
      )
      await queryClient.invalidateQueries({
        queryKey: adminOrdersQueryKeys.all,
      })
      toast({
        title: 'Статус оновлено',
        description: `Новий статус: ${orderStatusLabels[status]}`,
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Не вдалося змінити статус',
        description: error.message,
      })
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-full overflow-y-auto p-4 sm:max-w-2xl sm:p-6"
        aria-busy={orderQuery.isFetching || statusMutation.isPending}
      >
        <SheetHeader className="mb-6 pr-10 text-left">
          <SheetTitle>Деталі замовлення</SheetTitle>
          <SheetDescription>
            Повна інформація про замовлення та клієнта.
          </SheetDescription>
        </SheetHeader>

        {!orderId ? (
          <p className="text-muted-foreground text-sm">
            Замовлення не вибрано.
          </p>
        ) : orderQuery.isPending ? (
          <OrderDetailsSkeleton />
        ) : orderQuery.isError ? (
          <div
            className="border-destructive/40 bg-destructive/10 rounded-lg border p-4"
            role="alert"
          >
            <p className="text-destructive text-sm font-medium">
              {orderQuery.error.message}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => orderQuery.refetch()}
              disabled={orderQuery.isFetching}
            >
              {orderQuery.isFetching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Спробувати ще раз
            </Button>
          </div>
        ) : orderQuery.data ? (
          <OrderDetails
            order={orderQuery.data}
            statusMutation={statusMutation}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default OrderDetailsSheet
