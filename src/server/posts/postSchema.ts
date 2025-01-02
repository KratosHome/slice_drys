import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    content: {
      type: String,
      required: true,
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
      required: true,
      unique: true,
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
