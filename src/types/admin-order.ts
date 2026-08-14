import type { OrderStatus } from '@/constants/order-status'
import type {
  AdminOrderSortDirection,
  AdminOrderSortField,
} from '@/constants/admin-orders-query'

export interface AdminOrderProduct {
  id: string
  name: string
  count: number
  price: number
}

export interface AdminOrderUser {
  id: string
  name: string
  surname: string
  phone: string
  email: string
}

export interface AdminOrderDelivery {
  city?: string
  department?: string
  courier?: string
  phone: string
}

export type AdminOrderPaymentMethod = 'cash' | 'card' | 'COD' | 'unknown'

export interface AdminOrder {
  id: string
  status: OrderStatus
  products: AdminOrderProduct[]
  total: number
  user: AdminOrderUser
  delivery: AdminOrderDelivery
  payment: {
    method: AdminOrderPaymentMethod
  }
  comment: string
  createdAt: string
  updatedAt: string
}

export interface AdminOrdersPagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface GetAdminOrdersParams {
  status: OrderStatus
  page?: number
  pageSize?: number
  search?: string
  sort?: AdminOrderSortField
  order?: AdminOrderSortDirection
}

export type AdminOrderStatusCounts = Record<OrderStatus, number>

export interface AdminOrdersListResponse {
  success: true
  data: AdminOrder[]
  pagination: AdminOrdersPagination
}

export interface AdminOrderResponse {
  success: true
  data: AdminOrder
}

export interface AdminOrderStatusCountsResponse {
  success: true
  data: AdminOrderStatusCounts
}

export interface AdminOrdersErrorResponse {
  success: false
  message: string
}

export interface UpdateAdminOrderStatusInput {
  orderId: string
  status: OrderStatus
}
