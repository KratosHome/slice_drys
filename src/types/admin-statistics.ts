import type { OrderStatus } from '@/constants/order-status'

export type AdminStatisticsPeriod =
  | 'all'
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | 'this-year'
  | 'custom'

export type AdminStatisticsGrain = 'hour' | 'day' | 'week' | 'month'

export interface AdminStatisticsRawQuery {
  period?: unknown
  from?: unknown
  to?: unknown
}

export interface AdminStatisticsResolvedPeriod {
  key: AdminStatisticsPeriod
  timeZone: 'Europe/Kyiv'
  from: string | null
  to: string | null
  fromInclusive: string | null
  toExclusive: string | null
  grain: AdminStatisticsGrain
}

export interface AdminSalesSummary {
  totalCreatedOrders: number
  orders: number
  grossOrderValue: number
  completedOrders: number
  completedOrderValue: number
  averageCompletedOrderValue: number
  unitsOrdered: number
  unitsCompleted: number
  cancelledOrders: number
  cancelledOrderValue: number
  cancelledUnits: number
  completionRate: number
  cancellationRate: number
}

export interface AdminStatisticsTimePoint {
  periodStart: string
  orders: number
  grossOrderValue: number
  completedOrders: number
  completedOrderValue: number
}

export interface AdminStatisticsStatusBucket {
  status: OrderStatus
  orders: number
  grossOrderValue: number
}

export interface AdminStatisticsTopProduct {
  productId: string | null
  name: string
  quantity: number
  completedValue: number
}

export type AdminStatisticsPaymentMethod = 'cash' | 'card' | 'COD' | 'unknown'

export interface AdminStatisticsPaymentBucket {
  method: AdminStatisticsPaymentMethod
  orders: number
  grossOrderValue: number
}

export interface AdminStatisticsTopCity {
  city: string
  orders: number
  grossOrderValue: number
}

export type AdminStatisticsReferralCoverage =
  | 'unavailable'
  | 'partial'
  | 'complete'

export interface AdminStatisticsBloggerPayout {
  code: string
  name: string
  link: string | null
  interestPercent: number
  effectiveInterestPercent: number | null
  rateBps: number
  completedOrders: number | null
  completedOrderValue: number | null
  accruedPayout: number | null
}

export interface AdminStatisticsBloggerPayouts {
  scope: 'completed'
  valueKind: 'accrued'
  coverage: AdminStatisticsReferralCoverage
  trackingStartedAt: string | null
  trackedOrders: number
  attributedOrders: number
  legacyOrdersWithoutAttribution: number
  note: string | null
  items: AdminStatisticsBloggerPayout[]
}

export interface AdminStatisticsReconciliation {
  statusOrdersDelta: number
  statusGrossOrderValueDelta: number
  timeSeriesOrdersDelta: number
  timeSeriesGrossOrderValueDelta: number
}

export interface AdminStatisticsDataQuality {
  invalidStatusOrders: number
  invalidTotalOrders: number
  missingOrInvalidCreatedAtOrders: number
  invalidProductLines: number
  unknownPaymentOrders: number
  missingCityOrders: number
  referralOrdersMissingRate: number
  completedOrdersWithLineTotalMismatch: number
  reconciliation: AdminStatisticsReconciliation
}

export interface AdminStatisticsFreshness {
  generatedAt: string
  oldestOrderAt: string | null
  newestOrderAt: string | null
  source: 'live'
}

export interface AdminSalesStatistics {
  currency: 'UAH'
  period: AdminStatisticsResolvedPeriod
  summary: AdminSalesSummary
  timeSeries: AdminStatisticsTimePoint[]
  statusBreakdown: AdminStatisticsStatusBucket[]
  topProducts: {
    scope: 'completed'
    items: AdminStatisticsTopProduct[]
  }
  paymentBreakdown: AdminStatisticsPaymentBucket[]
  topCities: AdminStatisticsTopCity[]
  bloggerPayouts: AdminStatisticsBloggerPayouts
  dataQuality: AdminStatisticsDataQuality
  freshness: AdminStatisticsFreshness
}

export interface AdminSalesStatisticsResponse {
  success: true
  data: AdminSalesStatistics
}

export interface AdminSalesStatisticsErrorResponse {
  success: false
  message: string
}
