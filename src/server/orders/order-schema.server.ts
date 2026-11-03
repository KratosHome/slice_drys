import mongoose from 'mongoose'

import { ORDER_STATUSES } from '@/constants/order-status'

interface DepartmentDelivery {
  city: string
  department: string
  phone: string
}

interface CourierDelivery {
  courier: string
  phone: string
}

type Delivery = DepartmentDelivery | CourierDelivery

const attributionSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      enum: [1],
      required: true,
    },
    source: {
      type: String,
      enum: ['organic', 'referral'],
      required: true,
    },
    evaluatedAt: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: false,
    },
    bloggerName: {
      type: String,
      required: false,
    },
    bloggerLink: {
      type: String,
      required: false,
    },
    rateBps: {
      type: Number,
      min: 0,
      max: 10_000,
      validate: Number.isInteger,
      required: false,
    },
    commissionAmount: {
      type: Number,
      min: 0,
      validate: Number.isFinite,
      required: false,
    },
  },
  { _id: false },
)

const orderSchemaServer = new mongoose.Schema(
  {
    idempotencyKey: { type: String, immutable: true },
    requestHash: { type: String, immutable: true },
    purchaseDelivery: {
      type: new mongoose.Schema(
        {
          state: {
            type: String,
            enum: ['pending', 'received'],
            required: true,
          },
          nextAttemptAt: Date,
          leaseId: String,
          attempts: { type: Number, required: true },
          receivedAt: Date,
          lastError: String,
          clientId: { type: String, required: true, immutable: true },
        },
        { _id: false },
      ),
      required: false,
    },
    status: {
      type: String,
      enum: [...ORDER_STATUSES],
      required: true,
    },
    products: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          count: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          weight: {
            type: Number,
            required: false,
          },
        },
      ],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    attribution: {
      type: attributionSchema,
      required: false,
    },
    user: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    delivery: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value: Delivery) {
          if ('city' in value && 'department' in value) {
            return (
              'phone' in value &&
              typeof value.city === 'string' &&
              value.city.length > 0 &&
              typeof value.department === 'string' &&
              value.department.length > 0 &&
              typeof value.phone === 'string' &&
              !('courier' in value)
            )
          }

          if ('courier' in value) {
            return (
              'phone' in value &&
              typeof value.courier === 'string' &&
              value.courier.length > 0 &&
              typeof value.phone === 'string' &&
              !('city' in value) &&
              !('department' in value)
            )
          }
          return false
        },
        message:
          'Invalid delivery structure. Must be either department or courier delivery.',
      },
    },
    payment: {
      method: {
        type: String,
        enum: ['cash', 'card'],
        required: true,
      },
    },
    comment: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
)

orderSchemaServer.index({ status: 1, createdAt: -1, _id: -1 })
orderSchemaServer.index({ createdAt: 1 })
orderSchemaServer.index(
  { 'purchaseDelivery.state': 1, 'purchaseDelivery.nextAttemptAt': 1 },
  { partialFilterExpression: { 'purchaseDelivery.state': 'pending' } },
)

const keyIndexOptions = {
  unique: true,
  partialFilterExpression: { idempotencyKey: { $type: 'string' } },
}
orderSchemaServer.index({ idempotencyKey: 1 }, keyIndexOptions)

export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchemaServer)

// A new instance may receive a checkout before Mongoose's background index
// build finishes, or run with autoIndex disabled. Wait before accepting writes.
let keyIndexReady: Promise<string> | undefined
export function ensureOrderKeyIndex() {
  keyIndexReady ??= Order.collection
    .createIndex({ idempotencyKey: 1 }, keyIndexOptions)
    .catch((error: unknown) => {
      keyIndexReady = undefined
      throw error
    })
  return keyIndexReady
}
