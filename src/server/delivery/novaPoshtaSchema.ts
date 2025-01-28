import mongoose from 'mongoose'

const novaPoshtaSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    branches: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
)

export const NovaPoshta =
  mongoose.models.NovaPoshta || mongoose.model('NovaPoshta', novaPoshtaSchema)
