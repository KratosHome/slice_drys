import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      en: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
      },
      uk: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      en: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
      },
      uk: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
      },
    },
    img: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
    },
    variables: [
      {
        weight: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        newPrice: {
          type: Number,
          required: false,
        },
        currency: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 10,
        },
        count: {
          type: Number,
          required: true,
        },
        sold: {
          type: Number,
          required: false,
        },
      },
    ],
    nutritionalValue: {
      proteins: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,
      },
      fats: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,
      },
      carbohydrates: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,
      },
      energyValue: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,
      },
    },
    statusLabel: {
      type: [String],
      enum: ['new', 'sale', 'top'],
      required: false,
      minlength: 1,
      maxlength: 255,
    },
    visited: {
      type: Number,
      required: false,
      default: 0,
    },
    menu: {
      en: {
        type: [String],
        required: true,
        minlength: 1,
        maxlength: 255,
      },
      uk: {
        type: [String],
        required: true,
        minlength: 1,
        maxlength: 255,
      },
    },
    composition: {
      en: {
        type: [String],
        required: true,
        minlength: 1,
        maxlength: 255,
      },
      uk: {
        type: [String],
        required: true,
        minlength: 1,
        maxlength: 255,
      },
    },
    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    ],
  },
  { timestamps: true },
)

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)
