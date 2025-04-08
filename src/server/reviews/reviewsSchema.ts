import mongoose from 'mongoose'

const reviewsSchema = new mongoose.Schema(
  {
    author: {
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
    text: {
      en: {
        type: String,
        required: true,
        minlength: 1,
      },
      uk: {
        type: String,
        required: true,
        minlength: 1,
      },
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

export const Reviews =
  mongoose.models.Reviews || mongoose.model('Reviews', reviewsSchema)
