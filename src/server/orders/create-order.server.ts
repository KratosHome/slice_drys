'use server'

import { randomUUID } from 'node:crypto'

import mongoose from 'mongoose'
import { after } from 'next/server'
import { getLocale, getTranslations } from 'next-intl/server'

import { getReferralByCode } from '@/data/referals'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { sendOrderNotification } from '@/server/info/order-notification.server'
import { Order } from '@/server/orders/order-schema.server'
import { Product } from '@/server/products/product-schema.server'

const MAX_ORDER_LINES = 50
const MIN_ORDER_TOTAL = 300
const MAX_COMMENT_LENGTH = 2_000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class InvalidOrderError extends Error {
  constructor() {
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

interface PersistedProduct {
  id: string
  name: string
  count: number
  price: number
  weight: number
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
  const phone = getRequiredString(deliveryData.phone, 50)
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
): Promise<{ products: PersistedProduct[]; total: number }> {
  const productIds = [...new Set(requestedProducts.map((item) => item.id))]
  const productDocuments = await Product.find({ _id: { $in: productIds } })
    .select('_id name variables')
    .lean<ProductPricingDocument[]>()
  const productById = new Map(
    productDocuments.map((product) => [product._id.toString(), product]),
  )

  if (productById.size !== productIds.length) {
    throw new InvalidOrderError()
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
      throw new InvalidOrderError()
    }

    const price =
      typeof variant.newPrice === 'number' &&
      Number.isFinite(variant.newPrice) &&
      variant.newPrice > 0
        ? variant.newPrice
        : variant.price

    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
      throw new InvalidOrderError()
    }

    const name = product.name[locale] || product.name.uk || product.name.en

    if (typeof name !== 'string' || !name.trim()) {
      throw new InvalidOrderError()
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

  if (!Number.isFinite(total) || total < MIN_ORDER_TOTAL) {
    throw new InvalidOrderError()
  }

  return { products, total }
}

export async function createOrderServer(
  orderData: ICreateOrderInput,
): Promise<IOrderResponse> {
  const t = await getTranslations('order')
  const locale = (await getLocale()) as ILocale

  try {
    if (!isRecord(orderData)) throw new InvalidOrderError()

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

    if (!EMAIL_PATTERN.test(email)) throw new InvalidOrderError()

    const paymentMethod = paymentData.method

    if (paymentMethod !== 'cash' && paymentMethod !== 'card') {
      throw new InvalidOrderError()
    }

    const requestedProducts = normalizeRequestedProducts(orderData.products)
    const delivery = normalizeDelivery(deliveryData)

    await connectToDbServer()

    const trustedOrder = await getTrustedProducts(requestedProducts, locale)
    const comment =
      typeof orderData.comment === 'string'
        ? orderData.comment.trim().slice(0, MAX_COMMENT_LENGTH)
        : ''
    const attribution = buildAttribution(
      orderData.referralCode,
      trustedOrder.total,
    )
    const user = {
      id: `user-${randomUUID()}`,
      name: getRequiredString(userData.name, 120),
      surname: getRequiredString(userData.surname, 120),
      phone: getRequiredString(userData.phone, 50),
      email,
    }

    const order = new Order({
      status: 'new',
      products: trustedOrder.products,
      total: trustedOrder.total,
      attribution,
      user,
      delivery,
      payment: {
        method: paymentMethod,
      },
      comment,
    })

    await order.save()

    const notification = {
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
      callback: orderData.noCall === true ? 'НЕ ПОТРІБЕН' : 'ПОТРІБЕН',
      blogger:
        attribution.source === 'referral'
          ? {
              name: attribution.bloggerName,
              interest: attribution.rateBps / 100,
              link: attribution.bloggerLink,
              commissionAmount: attribution.commissionAmount,
            }
          : undefined,
    }

    after(() => sendOrderNotification(notification))

    return {
      success: true,
      message: {
        [locale]: t('success'),
      },
    }
  } catch (error) {
    if (!(error instanceof InvalidOrderError)) {
      console.error('Unexpected order creation failure', {
        name: error instanceof Error ? error.name : 'UnknownError',
      })
    }

    return {
      success: false,
      message: {
        [locale]: t('error'),
      },
    }
  }
}
