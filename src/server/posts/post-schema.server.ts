import mongoose from "mongoose";

const postSchemaServer = new mongoose.Schema(
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
        type: String,
        required: true,
      },
      uk: {
        type: String,
        required: true,
      },
    },
    visited: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Post =
  mongoose.models.Blog || mongoose.model("Blog", postSchemaServer);
