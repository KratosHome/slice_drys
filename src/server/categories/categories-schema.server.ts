import mongoose from 'mongoose'

const categoriesSchemaServer = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, minlength: 1, maxlength: 255 },
      uk: { type: String, required: true, minlength: 1, maxlength: 255 },
    },
    slug: { type: String, required: true, unique: true },
    description: {
      en: { type: String, maxlength: 8500 },
      uk: { type: String, maxlength: 8500 },
    },
    metaTitle: {
      en: { type: String, maxlength: 255 },
      uk: { type: String, maxlength: 255 },
    },
    metaDescription: {
      en: { type: String, maxlength: 500 },
      uk: { type: String, maxlength: 500 },
    },
    metaKeywords: {
      en: { type: String, maxlength: 255 },
      uk: { type: String, maxlength: 255 },
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    order: { type: Number, default: 0 },
    image: { type: String, maxlength: 255 },
  },
  { timestamps: true },
)

export const Category =
  mongoose.models.Category || mongoose.model('Category', categoriesSchemaServer)
