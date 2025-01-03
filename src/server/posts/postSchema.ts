import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
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
