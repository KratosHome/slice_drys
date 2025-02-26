import mongoose from 'mongoose'

const menuSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, minlength: 1, maxlength: 255 },
      uk: { type: String, required: true, minlength: 1, maxlength: 255 },
    },
    slug: { type: String, required: true, unique: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
  },
  { timestamps: true },
)

export const Menu = mongoose.models.Menu || mongoose.model('Menu', menuSchema)
