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
        required: false,
        minlength: 1,
      },
      uk: {
        type: String,
        required: false,
        minlength: 1,
      },
    },
    img: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: false,
      unique: false, // todo change to true
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      required: false,
    },
    keywords: {
      type: [String],
      required: false,
    },
    readingTime: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
)

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema)
