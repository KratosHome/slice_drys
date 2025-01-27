import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'new',
        'awaitingPayment',
        'awaitingShipment',
        'shipped',
        'completed',
        'awaitingReturn',
        'cancelled',
        'failedDelivery',
      ],
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
      city: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    payment: {
      method: {
        type: String,
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

export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema)
