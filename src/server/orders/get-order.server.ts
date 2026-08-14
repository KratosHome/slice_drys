import 'server-only'

import mongoose from 'mongoose'

import {
  DEFAULT_ADMIN_ORDERS_QUERY,
  isAdminOrderSortDirection,
  isAdminOrderSortField,
} from '@/constants/admin-orders-query'
import { isOrderStatus } from '@/constants/order-status'
import { ApiError } from '@/server/api-error.server'
import { requirePermission } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Order } from '@/server/orders/order-schema.server'
import { serializeAdminOrder } from '@/server/orders/order-serializer.server'
import type {
  AdminOrder,
  AdminOrdersPagination,
  GetAdminOrdersParams,
} from '@/types/admin-order'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE = 100_000
const MAX_PAGE_SIZE = 100
const MAX_SEARCH_LENGTH = 100

export interface GetAdminOrdersResult {
  data: AdminOrder[]
  pagination: AdminOrdersPagination
}

function normalizeInteger(
  value: number | undefined,
  fallback: number,
  maximum: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(Math.max(Math.trunc(value), 1), maximum)
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getAdminOrders({
  status,
  page,
  pageSize,
  search,
  sort,
  order,
}: GetAdminOrdersParams): Promise<GetAdminOrdersResult> {
  await requirePermission('orders:read')

  if (!isOrderStatus(status)) {
    throw new ApiError(400, 'Invalid order status')
  }

  await connectToDbServer()

  const requestedPage = normalizeInteger(page, DEFAULT_PAGE, MAX_PAGE)
  const normalizedPageSize = normalizeInteger(
    pageSize,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  )
  const normalizedSearch = search?.trim().slice(0, MAX_SEARCH_LENGTH) ?? ''
  const normalizedSort = isAdminOrderSortField(sort)
    ? sort
    : DEFAULT_ADMIN_ORDERS_QUERY.sort
  const normalizedOrder = isAdminOrderSortDirection(order)
    ? order
    : DEFAULT_ADMIN_ORDERS_QUERY.order
  const sortDirection: 1 | -1 = normalizedOrder === 'asc' ? 1 : -1
  const sortDefinition: Record<string, 1 | -1> =
    normalizedSort === 'customer'
      ? {
          'user.name': sortDirection,
          'user.surname': sortDirection,
          _id: sortDirection,
        }
      : {
          [normalizedSort]: sortDirection,
          _id: sortDirection,
        }
  const query: Record<string, unknown> = { status }

  if (normalizedSearch) {
    const searchExpression = new RegExp(
      escapeRegularExpression(normalizedSearch),
      'i',
    )

    query.$or = [
      { 'user.name': searchExpression },
      { 'user.surname': searchExpression },
      { 'user.email': searchExpression },
      { 'user.phone': searchExpression },
      { 'delivery.city': searchExpression },
      { 'delivery.department': searchExpression },
      { 'delivery.courier': searchExpression },
      { comment: searchExpression },
    ]
  }

  const totalItems = await Order.countDocuments(query)
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedPageSize))
  const normalizedPage = Math.min(requestedPage, totalPages)
  const ordersQuery = Order.find(query)
    .sort(sortDefinition)
    .skip((normalizedPage - 1) * normalizedPageSize)
    .limit(normalizedPageSize)

  if (normalizedSort === 'customer') {
    ordersQuery.collation({ locale: 'uk', strength: 2 })
  }

  const orders = await ordersQuery.lean()

  return {
    data: orders.map(serializeAdminOrder),
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      totalItems,
      totalPages,
      hasPreviousPage: normalizedPage > 1,
      hasNextPage: normalizedPage < totalPages,
    },
  }
}

export async function getAdminOrderById(orderId: string): Promise<AdminOrder> {
  await requirePermission('orders:read')

  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, 'Invalid order id')
  }

  await connectToDbServer()

  const order = await Order.findById(orderId).lean()

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  return serializeAdminOrder(order)
}
