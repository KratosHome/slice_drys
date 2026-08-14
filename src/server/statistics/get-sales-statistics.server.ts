import 'server-only'

import mongoose from 'mongoose'

import {
  ADMIN_STATISTICS_GRAIN_BY_PERIOD,
  ADMIN_STATISTICS_MAX_CUSTOM_DAYS,
  ADMIN_STATISTICS_MAX_TIME_MS,
  ADMIN_STATISTICS_TIME_ZONE,
  ADMIN_STATISTICS_TOP_CITIES_LIMIT,
  ADMIN_STATISTICS_TOP_PRODUCTS_LIMIT,
  DEFAULT_ADMIN_STATISTICS_PERIOD,
  isAdminStatisticsPeriod,
} from '@/constants/admin-statistics'
import { ORDER_STATUSES, type OrderStatus } from '@/constants/order-status'
import { referrals } from '@/data/referals'
import { ApiError } from '@/server/api-error.server'
import { requirePermission } from '@/server/auth/require-admin.server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Order } from '@/server/orders/order-schema.server'
import type {
  AdminSalesStatistics,
  AdminSalesSummary,
  AdminStatisticsBloggerPayout,
  AdminStatisticsGrain,
  AdminStatisticsPaymentMethod,
  AdminStatisticsRawQuery,
  AdminStatisticsReferralCoverage,
  AdminStatisticsResolvedPeriod,
  AdminStatisticsTimePoint,
} from '@/types/admin-statistics'

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const MILLISECONDS_PER_DAY = 86_400_000
const TRACKING_DATE_SENTINEL = new Date('9999-12-31T00:00:00.000Z')

interface CalendarDateParts {
  year: number
  month: number
  day: number
}

interface TimeZoneDateParts extends CalendarDateParts {
  hour: number
  minute: number
  second: number
}

interface RawSummary {
  totalCreatedOrders?: unknown
  orders?: unknown
  grossOrderValue?: unknown
  completedOrders?: unknown
  completedOrderValue?: unknown
  unitsOrdered?: unknown
  unitsCompleted?: unknown
  cancelledOrders?: unknown
  cancelledOrderValue?: unknown
  cancelledUnits?: unknown
}

interface RawTimePoint {
  _id?: unknown
  orders?: unknown
  grossOrderValue?: unknown
  completedOrders?: unknown
  completedOrderValue?: unknown
}

interface RawStatusBucket {
  _id?: unknown
  orders?: unknown
  grossOrderValue?: unknown
}

interface RawTopProduct {
  productId?: unknown
  name?: unknown
  quantity?: unknown
  completedValue?: unknown
}

interface RawPaymentBucket {
  _id?: unknown
  orders?: unknown
  grossOrderValue?: unknown
}

interface RawTopCity {
  city?: unknown
  orders?: unknown
  grossOrderValue?: unknown
}

interface RawAttributionCoverage {
  trackedOrders?: unknown
  attributedOrders?: unknown
  trackingStartedAt?: unknown
  referralOrdersMissingRate?: unknown
}

interface RawBloggerPayout {
  _id?: unknown
  name?: unknown
  link?: unknown
  rateBps?: unknown
  completedOrders?: unknown
  completedOrderValue?: unknown
  accruedPayout?: unknown
}

interface RawDataQuality {
  invalidStatusOrders?: unknown
  invalidTotalOrders?: unknown
  missingOrInvalidCreatedAtOrders?: unknown
  invalidProductLines?: unknown
  unknownPaymentOrders?: unknown
  missingCityOrders?: unknown
  referralOrdersMissingRate?: unknown
  completedOrdersWithLineTotalMismatch?: unknown
}

interface RawFreshness {
  oldestOrderAt?: unknown
  newestOrderAt?: unknown
}

interface RawAggregationResult {
  summary: RawSummary[]
  timeSeries: RawTimePoint[]
  statusBreakdown: RawStatusBucket[]
  topProducts: RawTopProduct[]
  paymentBreakdown: RawPaymentBucket[]
  topCities: RawTopCity[]
  attributionCoverage: RawAttributionCoverage[]
  bloggerPayouts: RawBloggerPayout[]
  dataQuality: RawDataQuality[]
  freshness: RawFreshness[]
}

const datePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ADMIN_STATISTICS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

function toFiniteNumber(value: unknown): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function toNonNegativeNumber(value: unknown): number {
  return Math.max(0, toFiniteNumber(value))
}

function roundMoney(value: unknown): number {
  return Math.round((toFiniteNumber(value) + Number.EPSILON) * 100) / 100
}

function roundRate(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function toIsoDate(value: unknown): string | null {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function readSingleQueryValue(
  value: unknown,
  name: string,
): string | undefined {
  if (value === undefined || value === null) return undefined

  if (Array.isArray(value)) {
    if (value.length !== 1 || typeof value[0] !== 'string') {
      throw new ApiError(
        400,
        `Query parameter "${name}" must be specified once`,
      )
    }

    return value[0].trim()
  }

  if (typeof value !== 'string') {
    throw new ApiError(400, `Query parameter "${name}" must be a string`)
  }

  return value.trim()
}

function parseCalendarDate(
  value: string,
  fieldName: string,
): CalendarDateParts {
  const match = DATE_PATTERN.exec(value)

  if (!match) {
    throw new ApiError(400, `${fieldName} must use YYYY-MM-DD format`)
  }

  const parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
  const validationDate = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  )

  if (
    validationDate.getUTCFullYear() !== parts.year ||
    validationDate.getUTCMonth() + 1 !== parts.month ||
    validationDate.getUTCDate() !== parts.day
  ) {
    throw new ApiError(400, `${fieldName} must be a valid calendar date`)
  }

  return parts
}

function formatCalendarDate(parts: CalendarDateParts): string {
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
}

function addCalendarDays(value: string, days: number): string {
  const parts = parseCalendarDate(value, 'date')
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days))

  return formatCalendarDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  })
}

function getTimeZoneParts(date: Date): TimeZoneDateParts {
  const values = Object.fromEntries(
    datePartsFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  )

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  }
}

function getTimeZoneDate(date: Date): string {
  return formatCalendarDate(getTimeZoneParts(date))
}

function startOfKyivDate(value: string): Date {
  const target = parseCalendarDate(value, 'date')
  const targetAsUtc = Date.UTC(target.year, target.month - 1, target.day)
  let candidate = targetAsUtc

  // Resolve the IANA-zone offset iteratively. This handles Kyiv's DST without
  // hard-coding +02:00/+03:00 and keeps the final Mongo match index-friendly.
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const local = getTimeZoneParts(new Date(candidate))
    const localAsUtc = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second,
    )
    const nextCandidate = candidate - (localAsUtc - targetAsUtc)

    if (nextCandidate === candidate) break
    candidate = nextCandidate
  }

  return new Date(candidate)
}

function inclusiveCalendarDays(from: string, to: string): number {
  const fromParts = parseCalendarDate(from, 'from')
  const toParts = parseCalendarDate(to, 'to')
  const fromTime = Date.UTC(fromParts.year, fromParts.month - 1, fromParts.day)
  const toTime = Date.UTC(toParts.year, toParts.month - 1, toParts.day)

  return Math.floor((toTime - fromTime) / MILLISECONDS_PER_DAY) + 1
}

function startOfCalendarWeek(value: string): string {
  const parts = parseCalendarDate(value, 'date')
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  const daysSinceMonday = (date.getUTCDay() + 6) % 7

  return addCalendarDays(value, -daysSinceMonday)
}

function startOfCalendarMonth(value: string): string {
  const parts = parseCalendarDate(value, 'date')

  return formatCalendarDate({ ...parts, day: 1 })
}

function addCalendarMonths(value: string, months: number): string {
  const parts = parseCalendarDate(value, 'date')
  const date = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1))

  return formatCalendarDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: 1,
  })
}

function customGrain(days: number): AdminStatisticsGrain {
  if (days <= 1) return 'hour'
  if (days <= 45) return 'day'
  if (days <= 180) return 'week'
  return 'month'
}

function resolveAdminStatisticsPeriod(
  rawQuery: AdminStatisticsRawQuery = {},
  now: Date = new Date(),
): AdminStatisticsResolvedPeriod {
  if (Number.isNaN(now.getTime())) {
    throw new ApiError(400, 'Invalid current date')
  }

  const rawPeriod = readSingleQueryValue(rawQuery.period, 'period')
  const period = rawPeriod ?? DEFAULT_ADMIN_STATISTICS_PERIOD
  const rawFrom = readSingleQueryValue(rawQuery.from, 'from')
  const rawTo = readSingleQueryValue(rawQuery.to, 'to')

  if (!isAdminStatisticsPeriod(period)) {
    throw new ApiError(400, 'Invalid statistics period')
  }

  if (period !== 'custom' && (rawFrom !== undefined || rawTo !== undefined)) {
    throw new ApiError(400, 'from and to are only allowed for custom period')
  }

  if (period === 'all') {
    return {
      key: period,
      timeZone: ADMIN_STATISTICS_TIME_ZONE,
      from: null,
      to: null,
      fromInclusive: null,
      toExclusive: null,
      grain: ADMIN_STATISTICS_GRAIN_BY_PERIOD.all,
    }
  }

  const today = getTimeZoneDate(now)
  let from: string
  let to: string
  let grain: AdminStatisticsGrain

  if (period === 'custom') {
    if (!rawFrom || !rawTo) {
      throw new ApiError(400, 'Custom period requires from and to dates')
    }

    parseCalendarDate(rawFrom, 'from')
    parseCalendarDate(rawTo, 'to')
    const days = inclusiveCalendarDays(rawFrom, rawTo)

    if (days < 1) {
      throw new ApiError(400, 'from must not be later than to')
    }

    if (days > ADMIN_STATISTICS_MAX_CUSTOM_DAYS) {
      throw new ApiError(
        400,
        `Custom period cannot exceed ${ADMIN_STATISTICS_MAX_CUSTOM_DAYS} days`,
      )
    }

    from = rawFrom
    to = rawTo
    grain = customGrain(days)
  } else {
    to = today
    grain = ADMIN_STATISTICS_GRAIN_BY_PERIOD[period]

    switch (period) {
      case 'today':
        from = today
        break
      case '7d':
        from = addCalendarDays(today, -6)
        break
      case '30d':
        from = addCalendarDays(today, -29)
        break
      case '90d':
        from = addCalendarDays(today, -89)
        break
      case 'this-year':
        from = `${today.slice(0, 4)}-01-01`
        break
    }
  }

  return {
    key: period,
    timeZone: ADMIN_STATISTICS_TIME_ZONE,
    from,
    to,
    fromInclusive: startOfKyivDate(from).toISOString(),
    toExclusive: startOfKyivDate(addCalendarDays(to, 1)).toISOString(),
    grain,
  }
}

function validNumberExpression(path: string) {
  return {
    $and: [{ $isNumber: path }, { $gte: [path, 0] }],
  }
}

function safeNumberExpression(path: string) {
  return {
    $cond: [validNumberExpression(path), path, 0],
  }
}

function validProductLineExpression(variable = '$$this') {
  return {
    $and: [
      { $isNumber: `${variable}.count` },
      { $gt: [`${variable}.count`, 0] },
      { $isNumber: `${variable}.price` },
      { $gte: [`${variable}.price`, 0] },
    ],
  }
}

function productsArrayExpression() {
  return {
    $cond: [{ $isArray: '$products' }, '$products', []],
  }
}

function unitsExpression() {
  return {
    $reduce: {
      input: productsArrayExpression(),
      initialValue: 0,
      in: {
        $add: [
          '$$value',
          {
            $cond: [validProductLineExpression(), '$$this.count', 0],
          },
        ],
      },
    },
  }
}

function lineValueExpression() {
  return {
    $reduce: {
      input: productsArrayExpression(),
      initialValue: 0,
      in: {
        $add: [
          '$$value',
          {
            $cond: [
              validProductLineExpression(),
              { $multiply: ['$$this.count', '$$this.price'] },
              0,
            ],
          },
        ],
      },
    },
  }
}

function buildPipeline(
  period: AdminStatisticsResolvedPeriod,
): mongoose.PipelineStage[] {
  const dateMatch: Record<string, unknown> = {}

  if (period.fromInclusive && period.toExclusive) {
    dateMatch.createdAt = {
      $gte: new Date(period.fromInclusive),
      $lt: new Date(period.toExclusive),
    }
  }

  const dateTrunc: Record<string, unknown> = {
    date: '$createdAt',
    unit: period.grain,
    timezone: ADMIN_STATISTICS_TIME_ZONE,
  }

  if (period.grain === 'week') dateTrunc.startOfWeek = 'monday'

  const productId = {
    $trim: {
      input: {
        $convert: {
          input: '$products.id',
          to: 'string',
          onError: '',
          onNull: '',
        },
      },
    },
  }
  const productName = {
    $trim: {
      input: {
        $convert: {
          input: '$products.name',
          to: 'string',
          onError: '',
          onNull: '',
        },
      },
    },
  }
  const trimmedCity = {
    $trim: {
      input: {
        $convert: {
          input: '$delivery.city',
          to: 'string',
          onError: '',
          onNull: '',
        },
      },
    },
  }
  const trimmedCourier = {
    $trim: {
      input: {
        $convert: {
          input: '$delivery.courier',
          to: 'string',
          onError: '',
          onNull: '',
        },
      },
    },
  }
  const validTotal = validNumberExpression('$total')
  const safeTotal = safeNumberExpression('$total')
  const safeUnits = unitsExpression()
  const validStatuses = [...ORDER_STATUSES]
  const cancelledStatuses = ['cancelled']
  const isCancelled = { $in: ['$status', cancelledStatuses] }

  return [
    ...(Object.keys(dateMatch).length ? [{ $match: dateMatch }] : []),
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalCreatedOrders: { $sum: 1 },
              orders: { $sum: { $cond: [isCancelled, 0, 1] } },
              grossOrderValue: {
                $sum: { $cond: [isCancelled, 0, safeTotal] },
              },
              completedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              completedOrderValue: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'completed'] }, safeTotal, 0],
                },
              },
              unitsOrdered: {
                $sum: { $cond: [isCancelled, 0, safeUnits] },
              },
              unitsCompleted: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'completed'] }, safeUnits, 0],
                },
              },
              cancelledOrders: {
                $sum: { $cond: [isCancelled, 1, 0] },
              },
              cancelledOrderValue: {
                $sum: { $cond: [isCancelled, safeTotal, 0] },
              },
              cancelledUnits: {
                $sum: { $cond: [isCancelled, safeUnits, 0] },
              },
            },
          },
        ],
        timeSeries: [
          {
            $match: {
              createdAt: { $type: 'date' },
              status: { $nin: cancelledStatuses },
            },
          },
          {
            $group: {
              _id: { $dateTrunc: dateTrunc },
              orders: { $sum: 1 },
              grossOrderValue: { $sum: safeTotal },
              completedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              completedOrderValue: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'completed'] }, safeTotal, 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ],
        statusBreakdown: [
          { $match: { status: { $in: validStatuses } } },
          {
            $group: {
              _id: '$status',
              orders: { $sum: 1 },
              grossOrderValue: { $sum: safeTotal },
            },
          },
        ],
        topProducts: [
          { $match: { status: 'completed' } },
          { $unwind: '$products' },
          { $match: { $expr: validProductLineExpression('$products') } },
          {
            $group: {
              _id: {
                $cond: [
                  { $gt: [{ $strLenCP: productId }, 0] },
                  { $concat: ['id:', productId] },
                  {
                    $concat: ['name:', { $toLower: productName }],
                  },
                ],
              },
              productId: {
                $first: {
                  $cond: [
                    { $gt: [{ $strLenCP: productId }, 0] },
                    productId,
                    null,
                  ],
                },
              },
              name: { $first: productName },
              quantity: { $sum: '$products.count' },
              completedValue: {
                $sum: { $multiply: ['$products.count', '$products.price'] },
              },
            },
          },
          { $sort: { quantity: -1, completedValue: -1, _id: 1 } },
          { $limit: ADMIN_STATISTICS_TOP_PRODUCTS_LIMIT },
          {
            $project: {
              _id: 0,
              productId: 1,
              name: 1,
              quantity: 1,
              completedValue: 1,
            },
          },
        ],
        paymentBreakdown: [
          { $match: { status: { $nin: cancelledStatuses } } },
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$payment.method', 'cash'] },
                      then: 'cash',
                    },
                    {
                      case: { $eq: ['$payment.method', 'card'] },
                      then: 'card',
                    },
                    { case: { $eq: ['$payment.method', 'COD'] }, then: 'COD' },
                  ],
                  default: 'unknown',
                },
              },
              orders: { $sum: 1 },
              grossOrderValue: { $sum: safeTotal },
            },
          },
        ],
        topCities: [
          {
            $match: {
              status: { $nin: cancelledStatuses },
              $expr: { $gt: [{ $strLenCP: trimmedCity }, 0] },
            },
          },
          {
            $group: {
              _id: { $toLower: trimmedCity },
              city: { $first: trimmedCity },
              orders: { $sum: 1 },
              grossOrderValue: { $sum: safeTotal },
            },
          },
          { $sort: { orders: -1, grossOrderValue: -1, _id: 1 } },
          { $limit: ADMIN_STATISTICS_TOP_CITIES_LIMIT },
          { $project: { _id: 0, city: 1, orders: 1, grossOrderValue: 1 } },
        ],
        attributionCoverage: [
          { $match: { status: 'completed', 'attribution.version': 1 } },
          {
            $group: {
              _id: null,
              trackedOrders: { $sum: 1 },
              attributedOrders: {
                $sum: {
                  $cond: [{ $eq: ['$attribution.source', 'referral'] }, 1, 0],
                },
              },
              trackingStartedAt: {
                $min: {
                  $cond: [
                    { $eq: [{ $type: '$attribution.evaluatedAt' }, 'date'] },
                    '$attribution.evaluatedAt',
                    TRACKING_DATE_SENTINEL,
                  ],
                },
              },
              referralOrdersMissingRate: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$attribution.source', 'referral'] },
                        {
                          $not: [
                            {
                              $and: [
                                { $isNumber: '$attribution.rateBps' },
                                { $gte: ['$attribution.rateBps', 0] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        bloggerPayouts: [
          {
            $match: {
              status: 'completed',
              'attribution.version': 1,
              'attribution.source': 'referral',
              'attribution.code': { $type: 'string', $ne: '' },
              $expr: {
                $and: [
                  { $isNumber: '$attribution.rateBps' },
                  { $gte: ['$attribution.rateBps', 0] },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$attribution.code',
              name: { $last: '$attribution.bloggerName' },
              link: { $last: '$attribution.bloggerLink' },
              rateBps: { $last: '$attribution.rateBps' },
              completedOrders: { $sum: 1 },
              completedOrderValue: { $sum: safeTotal },
              accruedPayout: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $isNumber: '$attribution.commissionAmount' },
                        { $gte: ['$attribution.commissionAmount', 0] },
                      ],
                    },
                    '$attribution.commissionAmount',
                    {
                      $round: [
                        {
                          $divide: [
                            {
                              $multiply: [safeTotal, '$attribution.rateBps'],
                            },
                            10_000,
                          ],
                        },
                        2,
                      ],
                    },
                  ],
                },
              },
            },
          },
          { $sort: { accruedPayout: -1, _id: 1 } },
        ],
        dataQuality: [
          {
            $group: {
              _id: null,
              invalidStatusOrders: {
                $sum: {
                  $cond: [{ $in: ['$status', validStatuses] }, 0, 1],
                },
              },
              invalidTotalOrders: {
                $sum: { $cond: [validTotal, 0, 1] },
              },
              missingOrInvalidCreatedAtOrders: {
                $sum: {
                  $cond: [{ $eq: [{ $type: '$createdAt' }, 'date'] }, 0, 1],
                },
              },
              invalidProductLines: {
                $sum: {
                  $reduce: {
                    input: productsArrayExpression(),
                    initialValue: 0,
                    in: {
                      $add: [
                        '$$value',
                        {
                          $cond: [validProductLineExpression(), 0, 1],
                        },
                      ],
                    },
                  },
                },
              },
              unknownPaymentOrders: {
                $sum: {
                  $cond: [
                    { $in: ['$payment.method', ['cash', 'card', 'COD']] },
                    0,
                    1,
                  ],
                },
              },
              missingCityOrders: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $gt: [{ $strLenCP: trimmedCity }, 0] },
                        { $gt: [{ $strLenCP: trimmedCourier }, 0] },
                      ],
                    },
                    0,
                    1,
                  ],
                },
              },
              referralOrdersMissingRate: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$attribution.version', 1] },
                        { $eq: ['$attribution.source', 'referral'] },
                        {
                          $not: [
                            {
                              $and: [
                                { $isNumber: '$attribution.rateBps' },
                                { $gte: ['$attribution.rateBps', 0] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              completedOrdersWithLineTotalMismatch: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$status', 'completed'] },
                        validTotal,
                        {
                          $gt: [
                            {
                              $abs: {
                                $subtract: [safeTotal, lineValueExpression()],
                              },
                            },
                            0.01,
                          ],
                        },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        freshness: [
          { $match: { createdAt: { $type: 'date' } } },
          {
            $group: {
              _id: null,
              oldestOrderAt: { $min: '$createdAt' },
              newestOrderAt: { $max: '$createdAt' },
            },
          },
        ],
      },
    },
  ] as mongoose.PipelineStage[]
}

function createSummary(raw: RawSummary | undefined): AdminSalesSummary {
  const totalCreatedOrders = toNonNegativeNumber(raw?.totalCreatedOrders)
  const orders = toNonNegativeNumber(raw?.orders)
  const completedOrders = toNonNegativeNumber(raw?.completedOrders)
  const completedOrderValue = roundMoney(raw?.completedOrderValue)
  const cancelledOrders = toNonNegativeNumber(raw?.cancelledOrders)

  return {
    totalCreatedOrders,
    orders,
    grossOrderValue: roundMoney(raw?.grossOrderValue),
    completedOrders,
    completedOrderValue,
    averageCompletedOrderValue:
      completedOrders > 0
        ? roundMoney(completedOrderValue / completedOrders)
        : 0,
    unitsOrdered: toNonNegativeNumber(raw?.unitsOrdered),
    unitsCompleted: toNonNegativeNumber(raw?.unitsCompleted),
    cancelledOrders,
    cancelledOrderValue: roundMoney(raw?.cancelledOrderValue),
    cancelledUnits: toNonNegativeNumber(raw?.cancelledUnits),
    completionRate:
      orders > 0 ? roundRate((completedOrders / orders) * 100) : 0,
    cancellationRate:
      totalCreatedOrders > 0
        ? roundRate((cancelledOrders / totalCreatedOrders) * 100)
        : 0,
  }
}

function isPaymentMethod(
  value: unknown,
): value is AdminStatisticsPaymentMethod {
  return ['cash', 'card', 'COD', 'unknown'].includes(String(value))
}

function createBloggerPayouts(
  summary: AdminSalesSummary,
  rawCoverage: RawAttributionCoverage | undefined,
  rawItems: RawBloggerPayout[],
) {
  const trackedOrders = toNonNegativeNumber(rawCoverage?.trackedOrders)
  const attributedOrders = toNonNegativeNumber(rawCoverage?.attributedOrders)
  const legacyOrdersWithoutAttribution = Math.max(
    0,
    summary.completedOrders - trackedOrders,
  )
  const referralOrdersMissingRate = toNonNegativeNumber(
    rawCoverage?.referralOrdersMissingRate,
  )
  let coverage: AdminStatisticsReferralCoverage

  if (summary.completedOrders === 0 || trackedOrders === 0) {
    coverage = 'unavailable'
  } else if (
    legacyOrdersWithoutAttribution > 0 ||
    referralOrdersMissingRate > 0
  ) {
    coverage = 'partial'
  } else {
    coverage = 'complete'
  }

  const rawByCode = new Map(
    rawItems.map((item) => [toStringValue(item._id), item]),
  )
  const configuredCodes = new Set<string>(
    referrals.map((referral) => referral.code),
  )
  const canReportValues = coverage !== 'unavailable'
  const items: AdminStatisticsBloggerPayout[] = referrals.map((referral) => {
    const raw = rawByCode.get(referral.code)
    const rateBps = referral.rateBps
    const completedOrderValue = canReportValues
      ? roundMoney(raw?.completedOrderValue)
      : null
    const accruedPayout = canReportValues
      ? roundMoney(raw?.accruedPayout)
      : null

    return {
      code: referral.code,
      name: referral.name,
      link: referral.link,
      interestPercent: roundRate(referral.rateBps / 100),
      effectiveInterestPercent:
        completedOrderValue && accruedPayout !== null
          ? roundRate((accruedPayout / completedOrderValue) * 100)
          : null,
      rateBps,
      completedOrders: canReportValues
        ? toNonNegativeNumber(raw?.completedOrders)
        : null,
      completedOrderValue,
      accruedPayout,
    }
  })

  for (const raw of rawItems) {
    const code = toStringValue(raw._id)

    if (!code || configuredCodes.has(code)) continue

    const rateBps = Math.round(toNonNegativeNumber(raw.rateBps))
    const completedOrderValue = canReportValues
      ? roundMoney(raw.completedOrderValue)
      : null
    const accruedPayout = canReportValues ? roundMoney(raw.accruedPayout) : null
    items.push({
      code,
      name: toStringValue(raw.name) || code,
      link: toStringValue(raw.link) || null,
      interestPercent: roundRate(rateBps / 100),
      effectiveInterestPercent:
        completedOrderValue && accruedPayout !== null
          ? roundRate((accruedPayout / completedOrderValue) * 100)
          : null,
      rateBps,
      completedOrders: canReportValues
        ? toNonNegativeNumber(raw.completedOrders)
        : null,
      completedOrderValue,
      accruedPayout,
    })
  }

  const trackingStartedAt = toIsoDate(rawCoverage?.trackingStartedAt)
  const isSentinel = trackingStartedAt === TRACKING_DATE_SENTINEL.toISOString()

  return {
    scope: 'completed' as const,
    valueKind: 'accrued' as const,
    coverage,
    trackingStartedAt: isSentinel ? null : trackingStartedAt,
    trackedOrders,
    attributedOrders,
    legacyOrdersWithoutAttribution,
    note:
      summary.completedOrders === 0
        ? 'У вибраному періоді немає виконаних замовлень, тому покриття й нарахування не розраховуються.'
        : coverage === 'unavailable'
          ? 'Історичні реферальні дані не зберігалися у виконаних замовленнях, тому нарахування за цей період недоступні. Нові замовлення вже зберігають блогера, ставку й суму комісії.'
          : coverage === 'partial'
            ? 'У частини виконаних замовлень немає даних атрибуції. Показані нарахування охоплюють лише відстежені замовлення.'
            : null,
    items,
  }
}

function zeroFilledTimeSeries(
  rawPoints: AdminStatisticsTimePoint[],
  period: AdminStatisticsResolvedPeriod,
  oldestOrderAt: string | null,
  newestOrderAt: string | null,
  now: Date,
): AdminStatisticsTimePoint[] {
  if (!rawPoints.length && !oldestOrderAt && !newestOrderAt) return []

  const rawByStart = new Map(
    rawPoints.map((point) => [point.periodStart, point]),
  )
  const bucketStarts: string[] = []
  let from = period.from
  let to = period.to

  if (!from || !to) {
    if (!oldestOrderAt || !newestOrderAt) return rawPoints
    from = getTimeZoneDate(new Date(oldestOrderAt))
    to = getTimeZoneDate(new Date(newestOrderAt))
  }

  if (period.grain === 'hour') {
    const start = startOfKyivDate(from).getTime()
    const requestedEnd = startOfKyivDate(addCalendarDays(to, 1)).getTime()
    const currentHourEnd =
      Math.floor(now.getTime() / (60 * 60 * 1_000)) * (60 * 60 * 1_000) +
      60 * 60 * 1_000
    const end = Math.min(requestedEnd, currentHourEnd)

    for (let time = start; time < end; time += 60 * 60 * 1_000) {
      bucketStarts.push(new Date(time).toISOString())
    }
  } else if (period.grain === 'day') {
    for (let day = from; day <= to; day = addCalendarDays(day, 1)) {
      bucketStarts.push(startOfKyivDate(day).toISOString())
    }
  } else if (period.grain === 'week') {
    for (
      let week = startOfCalendarWeek(from);
      week <= to;
      week = addCalendarDays(week, 7)
    ) {
      bucketStarts.push(startOfKyivDate(week).toISOString())
    }
  } else {
    for (
      let month = startOfCalendarMonth(from);
      month <= to;
      month = addCalendarMonths(month, 1)
    ) {
      bucketStarts.push(startOfKyivDate(month).toISOString())
    }
  }

  const filled = bucketStarts.map((periodStart) => {
    const raw = rawByStart.get(periodStart)
    rawByStart.delete(periodStart)

    return (
      raw ?? {
        periodStart,
        orders: 0,
        grossOrderValue: 0,
        completedOrders: 0,
        completedOrderValue: 0,
      }
    )
  })

  // Do not lose a real bucket if MongoDB and the Node ICU runtime have
  // different timezone-data revisions.
  return [...filled, ...rawByStart.values()].sort((left, right) =>
    left.periodStart.localeCompare(right.periodStart),
  )
}

export async function getSalesStatistics(
  rawQuery: AdminStatisticsRawQuery = {},
): Promise<AdminSalesStatistics> {
  await requirePermission('statistics:read')

  const now = new Date()
  const period = resolveAdminStatisticsPeriod(rawQuery, now)
  await connectToDbServer()

  const [rawResult] = await Order.aggregate<RawAggregationResult>(
    buildPipeline(period),
  ).option({
    allowDiskUse: true,
    maxTimeMS: ADMIN_STATISTICS_MAX_TIME_MS,
  })

  const result: RawAggregationResult = rawResult ?? {
    summary: [],
    timeSeries: [],
    statusBreakdown: [],
    topProducts: [],
    paymentBreakdown: [],
    topCities: [],
    attributionCoverage: [],
    bloggerPayouts: [],
    dataQuality: [],
    freshness: [],
  }
  const summary = createSummary(result.summary[0])
  const rawStatusByStatus = new Map(
    result.statusBreakdown.map((item) => [String(item._id), item]),
  )
  const statusBreakdown = ORDER_STATUSES.map((status: OrderStatus) => {
    const raw = rawStatusByStatus.get(status)

    return {
      status,
      orders: toNonNegativeNumber(raw?.orders),
      grossOrderValue: roundMoney(raw?.grossOrderValue),
    }
  })
  const rawTimeSeries = result.timeSeries.flatMap((item) => {
    const periodStart = toIsoDate(item._id)

    return periodStart
      ? [
          {
            periodStart,
            orders: toNonNegativeNumber(item.orders),
            grossOrderValue: roundMoney(item.grossOrderValue),
            completedOrders: toNonNegativeNumber(item.completedOrders),
            completedOrderValue: roundMoney(item.completedOrderValue),
          },
        ]
      : []
  })
  const paymentMethods: readonly AdminStatisticsPaymentMethod[] = [
    'cash',
    'card',
    'COD',
    'unknown',
  ]
  const rawPaymentByMethod = new Map(
    result.paymentBreakdown
      .filter((item) => isPaymentMethod(item._id))
      .map((item) => [item._id as AdminStatisticsPaymentMethod, item]),
  )
  const paymentBreakdown = paymentMethods.map((method) => {
    const raw = rawPaymentByMethod.get(method)

    return {
      method,
      orders: toNonNegativeNumber(raw?.orders),
      grossOrderValue: roundMoney(raw?.grossOrderValue),
    }
  })
  const rawDataQuality = result.dataQuality[0]
  const rawFreshness = result.freshness[0]
  const oldestOrderAt = toIsoDate(rawFreshness?.oldestOrderAt)
  const newestOrderAt = toIsoDate(rawFreshness?.newestOrderAt)
  const timeSeries = zeroFilledTimeSeries(
    rawTimeSeries,
    period,
    oldestOrderAt,
    newestOrderAt,
    now,
  )
  const mainStatusBreakdown = statusBreakdown.filter(
    (item) => item.status !== 'cancelled',
  )
  const statusOrders = mainStatusBreakdown.reduce(
    (sum, item) => sum + item.orders,
    0,
  )
  const statusValue = mainStatusBreakdown.reduce(
    (sum, item) => sum + item.grossOrderValue,
    0,
  )
  const timeSeriesOrders = timeSeries.reduce(
    (sum, item) => sum + item.orders,
    0,
  )
  const timeSeriesValue = timeSeries.reduce(
    (sum, item) => sum + item.grossOrderValue,
    0,
  )

  return {
    currency: 'UAH',
    period,
    summary,
    timeSeries,
    statusBreakdown,
    topProducts: {
      scope: 'completed',
      items: result.topProducts.map((item) => ({
        productId: toStringValue(item.productId) || null,
        name: toStringValue(item.name) || 'Невідомий товар',
        quantity: toNonNegativeNumber(item.quantity),
        completedValue: roundMoney(item.completedValue),
      })),
    },
    paymentBreakdown,
    topCities: result.topCities.map((item) => ({
      city: toStringValue(item.city),
      orders: toNonNegativeNumber(item.orders),
      grossOrderValue: roundMoney(item.grossOrderValue),
    })),
    bloggerPayouts: createBloggerPayouts(
      summary,
      result.attributionCoverage[0],
      result.bloggerPayouts,
    ),
    dataQuality: {
      invalidStatusOrders: toNonNegativeNumber(
        rawDataQuality?.invalidStatusOrders,
      ),
      invalidTotalOrders: toNonNegativeNumber(
        rawDataQuality?.invalidTotalOrders,
      ),
      missingOrInvalidCreatedAtOrders: toNonNegativeNumber(
        rawDataQuality?.missingOrInvalidCreatedAtOrders,
      ),
      invalidProductLines: toNonNegativeNumber(
        rawDataQuality?.invalidProductLines,
      ),
      unknownPaymentOrders: toNonNegativeNumber(
        rawDataQuality?.unknownPaymentOrders,
      ),
      missingCityOrders: toNonNegativeNumber(rawDataQuality?.missingCityOrders),
      referralOrdersMissingRate: toNonNegativeNumber(
        rawDataQuality?.referralOrdersMissingRate,
      ),
      completedOrdersWithLineTotalMismatch: toNonNegativeNumber(
        rawDataQuality?.completedOrdersWithLineTotalMismatch,
      ),
      reconciliation: {
        statusOrdersDelta: summary.orders - statusOrders,
        statusGrossOrderValueDelta: roundMoney(
          summary.grossOrderValue - statusValue,
        ),
        timeSeriesOrdersDelta: summary.orders - timeSeriesOrders,
        timeSeriesGrossOrderValueDelta: roundMoney(
          summary.grossOrderValue - timeSeriesValue,
        ),
      },
    },
    freshness: {
      generatedAt: now.toISOString(),
      oldestOrderAt,
      newestOrderAt,
      source: 'live',
    },
  }
}
