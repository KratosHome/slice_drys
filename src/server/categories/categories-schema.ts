import mongoose from 'mongoose'

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, minlength: 1, maxlength: 255 },
      uk: { type: String, required: true, minlength: 1, maxlength: 255 },
    },
    slug: { type: String, required: true, unique: true },
    description: {
      en: { type: String, maxlength: 500 },
      uk: { type: String, maxlength: 500 },
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
    image: { type: String, maxlength: 255 },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  },
  { timestamps: true },
)

export const Category =
  mongoose.models.Category || mongoose.model('Category', categoriesSchema)
