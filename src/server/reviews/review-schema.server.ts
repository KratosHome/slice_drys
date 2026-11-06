import 'server-only'

import mongoose from 'mongoose'
import {
  REVIEW_MAX_NAME_LENGTH,
  REVIEW_MAX_PHOTOS,
  REVIEW_MAX_TEXT_LENGTH,
} from '@/constants/product-review'
import { REVIEW_STATUSES } from '@/types/product-review'

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductReview',
      default: null,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: REVIEW_MAX_NAME_LENGTH,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: REVIEW_MAX_TEXT_LENGTH,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      validate: Number.isInteger,
      default: undefined,
    },
    photos: {
      type: [
        {
          _id: false,
          publicId: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
      validate: (photos: unknown[]) => photos.length <= REVIEW_MAX_PHOTOS,
    },
    status: {
      type: String,
      enum: REVIEW_STATUSES,
      default: 'pending',
      required: true,
    },
    isStoreRepresentative: { type: Boolean, default: false },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSlice',
      default: null,
    },
    moderatedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

reviewSchema.pre('validate', function () {
  if (this.parentId) {
    if (this.rating != null || this.photos.length > 0)
      this.invalidate('parentId', 'Replies cannot have ratings or photos')
  } else if (!Number.isInteger(this.rating)) {
    this.invalidate('rating', 'Reviews require a rating')
  }
})

reviewSchema.index({ productId: 1, parentId: 1, status: 1, createdAt: -1 })
reviewSchema.index({ parentId: 1 })
reviewSchema.index({ status: 1, createdAt: -1 })

export const ProductReviewModel =
  mongoose.models.ProductReview || mongoose.model('ProductReview', reviewSchema)

const rateLimitSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
})
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const ReviewRateLimit =
  mongoose.models.ReviewRateLimit ||
  mongoose.model('ReviewRateLimit', rateLimitSchema)
