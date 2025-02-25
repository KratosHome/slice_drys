import mongoose, { Schema } from 'mongoose'

const blockSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  settings: {
    uk: { type: Schema.Types.Mixed, default: {} },
    en: { type: Schema.Types.Mixed, default: {} },
  },
})

export const Block =
  mongoose.models.Block || mongoose.model('Block', blockSchema)
