'use server'

import { createHash, randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'

import mongoose from 'mongoose'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import { getLocale, getTranslations } from 'next-intl/server'

import { getReferralByCode } from '@/data/referals'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { sendOrderNotification } from '@/server/info/order-notification.server'
import { Order, ensureOrderKeyIndex } from '@/server/orders/order-schema.server'
import {
  getOrderReceipt,
  type ReceiptOrder,
} from '@/server/orders/order-receipt'
import {
  deliverPendingPurchases,
  purchaseDeliveryEnabled,
} from '@/server/orders/purchase-delivery.server'
import { Product } from '@/server/products/product-schema.server'
import { getProductPrice } from '@/utils/product-price'
import { MIN_ORDER_AMOUNT } from '@/constants/order'
import type { CheckoutErrorCode } from '@/constants/checkout-errors'
import { normalizeOrderPhone } from '@/utils/order-contact'
import { createCustomerReviewOrder } from '@/server/orders/customer-review.server'

const MAX_ORDER_LINES = 50
const MAX_COMMENT_LENGTH = 2_000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

class InvalidOrderError extends Error {
  constructor(readonly code: CheckoutErrorCode = 'invalid_order') {
    super('Invalid order')
    this.name = 'InvalidOrderError'
  }
}

interface RequestedProduct {
  id: string
  count: number
  weight: number
}

interface ProductPricingDocument {
  _id: mongoose.Types.ObjectId
  name: {
    en: string
    uk: string
  }
  variables: Array<{
    weight: number
    price: number
    newPrice?: number | null
    count: number
  }>
}

interface AcceptedOrder extends ReceiptOrder {
  createdAt: Date
  user: { email: string }
  requestHash: string
}

type OrderAttribution =
  | {
      version: 1
      source: 'organic'
      evaluatedAt: Date
    }
  | {
      version: 1
      source: 'referral'
      evaluatedAt: Date
      code: string
      bloggerName: string
      bloggerLink: string
      rateBps: number
      commissionAmount: number
    }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getRequiredString(value: unknown, maximumLength: number): string {
  if (typeof value !== 'string') throw new InvalidOrderError()

  const normalizedValue = value.trim()

  if (!normalizedValue || normalizedValue.length > maximumLength) {
    throw new InvalidOrderError()
  }

  return normalizedValue
}

function normalizeRequestedProducts(value: unknown): RequestedProduct[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.length > MAX_ORDER_LINES
  ) {
    throw new InvalidOrderError()
  }

  const aggregatedProducts = new Map<string, RequestedProduct>()

  for (const item of value) {
    if (!isRecord(item)) throw new InvalidOrderError()

    const id = typeof item.id === 'string' ? item.id.trim() : ''
    const count = item.count
    const weight = item.weight

    if (
      !/^[a-f\d]{24}$/i.test(id) ||
      typeof count !== 'number' ||
      !Number.isSafeInteger(count) ||
      count <= 0 ||
      typeof weight !== 'number' ||
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      throw new InvalidOrderError()
    }

    const key = `${id}:${weight}`
    const existingProduct = aggregatedProducts.get(key)
    const aggregatedCount = (existingProduct?.count ?? 0) + count

    if (!Number.isSafeInteger(aggregatedCount)) {
      throw new InvalidOrderError()
    }

    aggregatedProducts.set(key, {
      id,
      count: aggregatedCount,
      weight,
    })
  }

  return [...aggregatedProducts.values()]
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function normalizeDelivery(
  deliveryData: Record<string, unknown>,
): ICreateOrderDelivery {
  const phone = normalizeOrderPhone(deliveryData.phone)
  if (!phone) throw new InvalidOrderError()
  const courier =
    typeof deliveryData.courier === 'string' ? deliveryData.courier.trim() : ''

  if (courier) {
    if (
      typeof deliveryData.city === 'string' ||
      typeof deliveryData.department === 'string'
    ) {
      throw new InvalidOrderError()
    }

    return {
      courier: getRequiredString(courier, 255),
      phone,
    }
  }

  return {
    city: getRequiredString(deliveryData.city, 255),
    department: getRequiredString(deliveryData.department, 255),
    phone,
  }
}

function buildAttribution(
  referralCode: unknown,
  trustedTotal: number,
): OrderAttribution {
  const evaluatedAt = new Date()
  const normalizedCode =
    typeof referralCode === 'string' ? referralCode.trim() : undefined
  const referral = getReferralByCode(normalizedCode)

  if (!referral) {
    return {
      version: 1,
      source: 'organic',
      evaluatedAt,
    }
  }

  return {
    version: 1,
    source: 'referral',
    evaluatedAt,
    code: referral.code,
    bloggerName: referral.name,
    bloggerLink: referral.link,
    rateBps: referral.rateBps,
    commissionAmount: roundMoney((trustedTotal * referral.rateBps) / 10_000),
  }
}

async function getTrustedProducts(
  requestedProducts: RequestedProduct[],
  locale: ILocale,
): Promise<{ products: ReceiptOrder['products']; total: number }> {
  const productIds = [...new Set(requestedProducts.map((item) => item.id))]
  const productDocuments = await Product.find({ _id: { $in: productIds } })
    .select('_id name variables')
    .lean<ProductPricingDocument[]>()
  const productById = new Map(
    productDocuments.map((product) => [product._id.toString(), product]),
  )

  if (productById.size !== productIds.length) {
    throw new InvalidOrderError('product_unavailable')
  }

  let total = 0
  const products = requestedProducts.map((requestedProduct) => {
    const product = productById.get(requestedProduct.id)
    const variant = product?.variables.find(
      (item) => item.weight === requestedProduct.weight,
    )

    if (
      !product ||
      !variant ||
      !Number.isSafeInteger(variant.count) ||
      requestedProduct.count > variant.count
    ) {
      throw new InvalidOrderError('product_unavailable')
    }

    const price = getProductPrice(variant)

    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
      throw new InvalidOrderError('product_unavailable')
    }

    const name = product.name[locale] || product.name.uk || product.name.en

    if (typeof name !== 'string' || !name.trim()) {
      throw new InvalidOrderError('product_unavailable')
    }

    const normalizedPrice = roundMoney(price)
    total = roundMoney(total + normalizedPrice * requestedProduct.count)

    return {
      id: product._id.toString(),
      name: name.trim(),
      count: requestedProduct.count,
      price: normalizedPrice,
      weight: requestedProduct.weight,
    }
  })

  if (!Number.isFinite(total)) throw new InvalidOrderError()
  if (total < MIN_ORDER_AMOUNT) {
    throw new InvalidOrderError('minimum_order_amount')
  }

  return { products, total }
}

async function getAnalyticsClientId(): Promise<string> {
  // Accept only a GA-generated numeric client ID. Never forward arbitrary
  // cookie values or derive an identifier from customer contact information.
  try {
    const value = (await cookies()).get('_ga')?.value ?? ''
    const id = /^GA\d+\.\d+\.(\d{1,10}\.\d{1,10})$/.exec(value)?.[1]
    if (id) return id
  } catch {
    // Checkout still works when cookies aren't available.
  }
  return randomUUID()
}

function acceptedOrderResponse(
  order: AcceptedOrder,
  requestHash: string,
  message: IOrderResponse['message'],
): IOrderResponse {
  if (order.requestHash !== requestHash) {
    throw new InvalidOrderError('idempotency_conflict')
  }
  const response: IOrderResponse = {
    success: true,
    message,
    receipt: getOrderReceipt(order),
  }
  try {
    response.customerReview = createCustomerReviewOrder(
      response.receipt.transactionId,
      order.user.email,
      order.createdAt,
    )
  } catch {
    console.error('Could not prepare the customer review for an accepted order')
  }
  return response
}

function scheduleAfterAcceptance(name: string, task: () => Promise<unknown>) {
  try {
    after(async () => {
      try {
        await task()
      } catch {
        console.error(`Could not run ${name} for an accepted order`)
      }
    })
  } catch {
    console.error(`Could not schedule ${name} for an accepted order`)
  }
}

export async function createOrderServer(
  orderData: ICreateOrderInput,
): Promise<IOrderResponse> {
  const t = await getTranslations('order')
  const locale = (await getLocale()) as ILocale

  try {
    if (
      !isRecord(orderData) ||
      typeof orderData.idempotencyKey !== 'string' ||
      !UUID_V4.test(orderData.idempotencyKey)
    ) {
      throw new InvalidOrderError()
    }
    const idempotencyKey = orderData.idempotencyKey.toLowerCase()

    const userData = orderData.user
    const deliveryData = orderData.delivery
    const paymentData = orderData.payment

    if (
      !isRecord(userData) ||
      !isRecord(deliveryData) ||
      !isRecord(paymentData)
    ) {
      throw new InvalidOrderError()
    }

    const email = getRequiredString(userData.email, 150).toLowerCase()
    const phone = normalizeOrderPhone(userData.phone)

    if (!EMAIL_PATTERN.test(email) || !phone) throw new InvalidOrderError()

    const paymentMethod = paymentData.method

    if (paymentMethod !== 'cash' && paymentMethod !== 'card') {
      throw new InvalidOrderError()
    }

    const requestedProducts = normalizeRequestedProducts(orderData.products)
    const delivery = normalizeDelivery(deliveryData)

    const comment =
      typeof orderData.comment === 'string'
        ? orderData.comment.trim().slice(0, MAX_COMMENT_LENGTH)
        : ''
    const user = {
      name: getRequiredString(userData.name, 120),
      surname: getRequiredString(userData.surname, 120),
      phone,
      email,
    }
    const noCall = orderData.noCall === true
    const referralCode =
      typeof orderData.referralCode === 'string'
        ? orderData.referralCode.trim()
        : ''
    const requestHash = createHash('sha256')
      .update(
        JSON.stringify({
          user,
          delivery,
          paymentMethod,
          comment,
          noCall,
          referralCode,
          products: [...requestedProducts].sort(
            (a, b) => a.id.localeCompare(b.id) || a.weight - b.weight,
          ),
        }),
      )
      .digest('hex')
    const message = { [locale]: t('success') }

    await connectToDbServer()
    await ensureOrderKeyIndex()
    const findPriorOrder = () =>
      Order.findOne({ idempotencyKey })
        .read('primary')
        .readConcern('majority')
        .select('_id total products user.email createdAt requestHash')
        .lean<AcceptedOrder | null>()
    const existing = await findPriorOrder()
    if (existing) return acceptedOrderResponse(existing, requestHash, message)

    let trustedOrder
    try {
      trustedOrder = await getTrustedProducts(requestedProducts, locale)
    } catch (error) {
      // Another request can accept this order while the catalog is changing.
      const winner = await findPriorOrder()
      if (winner) return acceptedOrderResponse(winner, requestHash, message)
      throw error
    }
    const attribution = buildAttribution(referralCode, trustedOrder.total)
    const purchaseDelivery = purchaseDeliveryEnabled()
      ? {
          state: 'pending',
          nextAttemptAt: new Date(),
          attempts: 0,
          clientId: await getAnalyticsClientId(),
        }
      : undefined

    const order = new Order({
      idempotencyKey,
      requestHash,
      purchaseDelivery,
      status: 'new',
      products: trustedOrder.products,
      total: trustedOrder.total,
      attribution,
      user: { ...user, id: `user-${randomUUID()}` },
      delivery,
      payment: {
        method: paymentMethod,
      },
      comment,
    })

    let accepted: AcceptedOrder = order
    try {
      await order.save({ w: 'majority' })
    } catch (error) {
      // A concurrent insert can win, and a successful write can lose its
      // acknowledgement. In both cases return the document MongoDB accepted.
      let winner = await findPriorOrder()
      if (!winner && isRecord(error) && error.code === 11000) {
        // The unique index can reject a racing insert before the winner is
        // visible to a majority read. Wait briefly for replication.
        for (const waitMs of [50, 200, 750]) {
          await delay(waitMs)
          winner = await findPriorOrder()
          if (winner) break
        }
      }
      if (!winner) throw error
      if (winner._id.toString() !== order._id.toString()) {
        return acceptedOrderResponse(winner, requestHash, message)
      }
      // Our insert committed, so this request still owns its notifications.
      accepted = winner
    }

    if (purchaseDelivery) {
      scheduleAfterAcceptance('purchase delivery', () =>
        deliverPendingPurchases({ orderId: order._id.toString(), limit: 1 }),
      )
    }
    scheduleAfterAcceptance('order notification', () =>
      sendOrderNotification({
        totalPrice: `${trustedOrder.total} ₴`,
        paymentMethod: paymentMethod === 'cash' ? 'післяоплата' : 'на картку',
        name: `${user.name} ${user.surname}`,
        phone: user.phone,
        delivery:
          'courier' in delivery
            ? `Кур'єром: ${delivery.courier}`
            : `Новою поштою: ${delivery.city}, ${delivery.department}`,
        comment: comment || 'Немає коментарів',
        products: trustedOrder.products
          .map(
            (product, index) =>
              `${index + 1}. ${product.name} (вага ${product.weight}) x ${product.count} од`,
          )
          .join('\n'),
        callback: noCall ? 'НЕ ПОТРІБЕН' : 'ПОТРІБЕН',
        blogger:
          attribution.source === 'referral'
            ? {
                name: attribution.bloggerName,
                interest: attribution.rateBps / 100,
                link: attribution.bloggerLink,
                commissionAmount: attribution.commissionAmount,
              }
            : undefined,
      }),
    )
    return acceptedOrderResponse(accepted, requestHash, message)
  } catch (error) {
    if (!(error instanceof InvalidOrderError)) {
      console.error('Unexpected order creation failure', {
        name: error instanceof Error ? error.name : 'UnknownError',
      })
    }

    return {
      success: false,
      errorCode:
        error instanceof InvalidOrderError ? error.code : 'order_unconfirmed',
      message: {
        [locale]: t(
          error instanceof InvalidOrderError ? 'error' : 'unconfirmed',
        ),
      },
    }
  }
}
