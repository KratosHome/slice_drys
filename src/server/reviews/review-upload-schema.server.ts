import 'server-only'

import mongoose from 'mongoose'
import {
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_MAX_PHOTOS,
  REVIEW_PHOTO_TYPES,
  REVIEW_UPLOAD_CHUNK_BYTES,
} from '@/constants/product-review'

const uploadFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
    type: { type: String, required: true, enum: REVIEW_PHOTO_TYPES },
    size: {
      type: Number,
      required: true,
      min: 1,
      max: REVIEW_MAX_PHOTO_BYTES,
      validate: Number.isSafeInteger,
    },
  },
  { _id: false },
)

const uploadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  tokenHash: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  files: {
    type: [uploadFileSchema],
    required: true,
    validate: (files: unknown[]) =>
      files.length >= 1 && files.length <= REVIEW_MAX_PHOTOS,
  },
  state: {
    type: String,
    enum: ['open', 'processing'],
    default: 'open',
    required: true,
  },
  expiresAt: { type: Date, required: true },
})
uploadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const chunkSchema = new mongoose.Schema({
  // The key makes a chunk immutable and unique even before secondary indexes
  // finish building on a newly provisioned database.
  _id: { type: String, required: true },
  uploadId: { type: String, required: true },
  fileIndex: {
    type: Number,
    required: true,
    min: 0,
    max: REVIEW_MAX_PHOTOS - 1,
    validate: Number.isInteger,
  },
  chunkIndex: {
    type: Number,
    required: true,
    min: 0,
    validate: Number.isInteger,
  },
  hash: { type: String, required: true },
  data: {
    type: Buffer,
    required: true,
    validate: (data: Buffer) =>
      data.length > 0 && data.length <= REVIEW_UPLOAD_CHUNK_BYTES,
  },
  expiresAt: { type: Date, required: true },
})
chunkSchema.index(
  { uploadId: 1, fileIndex: 1, chunkIndex: 1 },
  { unique: true },
)
// Expiring just the session would leave abandoned binary data behind.
chunkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const quotaSlotSchema = new mongoose.Schema(
  {
    uploadId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    bytes: {
      type: Number,
      required: true,
      min: 1,
      max: REVIEW_MAX_PHOTOS * REVIEW_MAX_PHOTO_BYTES,
      validate: Number.isSafeInteger,
    },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
)
const quotaSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  slots: {
    type: [quotaSlotSchema],
    default: [],
    validate: (slots: unknown[]) => slots.length <= 256,
  },
})

export const ReviewUploadSession =
  mongoose.models.ReviewUploadSession ||
  mongoose.model('ReviewUploadSession', uploadSchema)
export const ReviewUploadChunk =
  mongoose.models.ReviewUploadChunk ||
  mongoose.model('ReviewUploadChunk', chunkSchema)
export const ReviewUploadQuota =
  mongoose.models.ReviewUploadQuota ||
  mongoose.model('ReviewUploadQuota', quotaSchema)
