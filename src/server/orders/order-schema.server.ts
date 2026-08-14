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
interface DeliveryValidationProps {
  value: Delivery
}
const orderSchemaServer = new mongoose.Schema(
  {
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
        },
      ],
      required: true,
    },
    total: {
      type: Number,
      required: true,
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
        message: (props: DeliveryValidationProps) =>
          `Invalid delivery structure: ${JSON.stringify(props.value)}. Must be either {city, department, phone} or {courier, phone}`,
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

export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchemaServer)
