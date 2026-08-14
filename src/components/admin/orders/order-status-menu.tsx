'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Package,
  RotateCcw,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

import { adminOrdersQueryKeys } from '@/components/admin/orders/order-details-sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ORDER_STATUSES, type OrderStatus } from '@/constants/order-status'
import { toast } from '@/hooks/useToast'
import type {
  AdminOrder,
  AdminOrderResponse,
  AdminOrdersErrorResponse,
  UpdateAdminOrderStatusInput,
} from '@/types/admin-order'
import { cn } from '@/utils/cn'

interface OrderStatusMeta {
  label: string
  icon: LucideIcon
  className: string
}

const orderStatusMeta: Record<OrderStatus, OrderStatusMeta> = {
  new: {
    label: 'Нове',
    icon: Clock3,
    className: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
  },
  awaitingPayment: {
    label: 'Очікує оплати',
    icon: AlertCircle,
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
  },
  awaitingShipment: {
    label: 'Очікує відправки',
    icon: Package,
    className: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
  },
  shipped: {
    label: 'Відправлено',
    icon: Truck,
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  },
  completed: {
    label: 'Виконано',
    icon: CheckCircle2,
    className: 'border-green-500/30 bg-green-500/10 text-green-500',
  },
  awaitingReturn: {
    label: 'Очікує повернення',
    icon: RotateCcw,
    className: 'border-orange-500/30 bg-orange-500/10 text-orange-500',
  },
  cancelled: {
    label: 'Скасовано',
    icon: XCircle,
    className: 'border-red-500/30 bg-red-500/10 text-red-500',
  },
  failedDelivery: {
    label: 'Не доставлено',
    icon: AlertCircle,
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-500',
  },
}

async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<AdminOrder> {
  const body: Pick<UpdateAdminOrderStatusInput, 'status'> = { status }
  const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    cache: 'no-store',
    body: JSON.stringify(body),
  })
  const payload = (await response.json().catch(() => null)) as
    | AdminOrderResponse
    | AdminOrdersErrorResponse
    | null

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && !payload.success
        ? payload.message
        : 'Не вдалося змінити статус замовлення',
    )
  }

  return payload.data
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = orderStatusMeta[status]
  const Icon = meta.icon

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-center text-xs leading-tight font-semibold',
        meta.className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="min-w-0 whitespace-normal">{meta.label}</span>
    </span>
  )
}

export default function OrderStatusMenu({ order }: { order: AdminOrder }) {
  const queryClient = useQueryClient()
  const fullName = `${order.user.name} ${order.user.surname}`.trim()
  const mutation = useMutation<AdminOrder, Error, OrderStatus>({
    mutationFn: (status) => updateOrderStatus(order.id, status),
    onSuccess: async (updatedOrder, status) => {
      queryClient.setQueryData(
        adminOrdersQueryKeys.detail(updatedOrder.id),
        updatedOrder,
      )
      await queryClient.invalidateQueries({
        queryKey: adminOrdersQueryKeys.all,
      })
      toast({
        title: 'Статус оновлено',
        description: `Новий статус: ${orderStatusMeta[status].label}`,
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
  const selectedStatus = mutation.isPending
    ? (mutation.variables ?? order.status)
    : order.status

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring flex w-full items-center justify-between gap-1 rounded-md text-left focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
          disabled={mutation.isPending}
          aria-label={`Змінити статус замовлення ${fullName}`}
          aria-busy={mutation.isPending}
        >
          <OrderStatusBadge status={selectedStatus} />
          {mutation.isPending ? (
            <Loader2 className="text-muted-foreground size-4 shrink-0 animate-spin" />
          ) : (
            <ChevronDown className="text-muted-foreground size-4 shrink-0" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="z-[70] w-56">
        {ORDER_STATUSES.map((status) => {
          const meta = orderStatusMeta[status]
          const Icon = meta.icon
          const isCurrent = status === order.status

          return (
            <DropdownMenuItem
              key={status}
              disabled={isCurrent || mutation.isPending}
              onSelect={() => mutation.mutate(status)}
              className="min-h-9"
            >
              <Icon className="text-muted-foreground size-4" />
              <span>{meta.label}</span>
              {isCurrent ? <Check className="ml-auto size-4" /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
