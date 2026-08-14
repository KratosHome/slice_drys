import { isOrderStatus } from '@/constants/order-status'
import type { AdminOrder, AdminOrderPaymentMethod } from '@/types/admin-order'

interface LeanOrderDocument {
  _id?: unknown
  status?: unknown
  products?: Array<{
    id?: unknown
    name?: unknown
    count?: unknown
    price?: unknown
  }>
  total?: unknown
  user?: {
    id?: unknown
    name?: unknown
    surname?: unknown
    phone?: unknown
    email?: unknown
  }
  delivery?: {
    city?: unknown
    department?: unknown
    courier?: unknown
    phone?: unknown
  }
  payment?: {
    method?: unknown
  }
  comment?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

const PAYMENT_METHODS = ['cash', 'card', 'COD'] as const

function toStringValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return ''
  return String(value)
}

function toNumberValue(value: unknown): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function toIsoDate(value: unknown): string {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

function toPaymentMethod(value: unknown): AdminOrderPaymentMethod {
  return typeof value === 'string' &&
    PAYMENT_METHODS.includes(value as (typeof PAYMENT_METHODS)[number])
    ? (value as AdminOrderPaymentMethod)
    : 'unknown'
}

export function serializeAdminOrder(value: unknown): AdminOrder {
  const order = value as LeanOrderDocument

  if (!isOrderStatus(order.status)) {
    throw new Error('Order contains an invalid status')
  }

  return {
    id: toStringValue(order._id),
    status: order.status,
    products: Array.isArray(order.products)
      ? order.products.map((product) => ({
          id: toStringValue(product.id),
          name: toStringValue(product.name),
          count: toNumberValue(product.count),
          price: toNumberValue(product.price),
        }))
      : [],
    total: toNumberValue(order.total),
    user: {
      id: toStringValue(order.user?.id),
      name: toStringValue(order.user?.name),
      surname: toStringValue(order.user?.surname),
      phone: toStringValue(order.user?.phone),
      email: toStringValue(order.user?.email),
    },
    delivery: {
      ...(order.delivery?.city !== undefined && {
        city: toStringValue(order.delivery.city),
      }),
      ...(order.delivery?.department !== undefined && {
        department: toStringValue(order.delivery.department),
      }),
      ...(order.delivery?.courier !== undefined && {
        courier: toStringValue(order.delivery.courier),
      }),
      phone: toStringValue(order.delivery?.phone),
    },
    payment: {
      method: toPaymentMethod(order.payment?.method),
    },
    comment: toStringValue(order.comment),
    createdAt: toIsoDate(order.createdAt),
    updatedAt: toIsoDate(order.updatedAt),
  }
}
