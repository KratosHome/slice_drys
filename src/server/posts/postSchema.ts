import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
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
    content: {
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
    img: {
      type: String,
      required: true,
    },
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
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    metaDescription: {
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
    keywords: {
      en: {
        type: [String],
        required: true,
      },
      uk: {
        type: [String],
        required: true,
      },
    },
    readingTime: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
)

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema)
