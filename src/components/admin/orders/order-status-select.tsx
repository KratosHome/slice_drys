'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { adminOrdersQueryKeys } from '@/components/admin/orders/order-details-sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '@/constants/order-status'
import { toast } from '@/hooks/useToast'
import type {
  AdminOrder,
  AdminOrderResponse,
  AdminOrdersErrorResponse,
  UpdateAdminOrderStatusInput,
} from '@/types/admin-order'

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

export default function OrderStatusSelect({ order }: { order: AdminOrder }) {
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
        description: `Новий статус: ${ORDER_STATUS_LABELS[status]}`,
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
    <div className="flex min-w-0 items-center gap-2">
      <Select
        value={selectedStatus}
        onValueChange={(value) => mutation.mutate(value as OrderStatus)}
        disabled={mutation.isPending}
      >
        <SelectTrigger
          className="bg-background h-9 min-w-0 flex-1 px-2 text-xs"
          aria-label={`Змінити статус замовлення ${fullName}`}
          aria-busy={mutation.isPending}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[70]">
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {mutation.isPending ? (
        <Loader2
          className="text-muted-foreground size-4 shrink-0 animate-spin"
          aria-label="Оновлення статусу"
        />
      ) : null}
    </div>
  )
}
