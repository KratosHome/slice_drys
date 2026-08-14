import mongoose from 'mongoose'

const userSchemaServer = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
      min: 3,
      max: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 150,
      lowercase: true,
      trim: true,
    },
    isEmailVerified: {
      redirect: true,
      type: Boolean,
      default: false,
    },
    isEmailVerifiedToken: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      required: true,
      type: String,
      enum: ['client', 'super-admin', 'manager'],
    },
    resetPasswordToken: String,
  },
  { timestamps: true },
)

export const UserSlice =
  mongoose.models?.UserSlice || mongoose.model('UserSlice', userSchemaServer)
