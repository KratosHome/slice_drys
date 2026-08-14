import mongoose from 'mongoose'

import { USER_ROLES } from '@/constants/user-role'

const userSchemaServer = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
      minlength: 3,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 150,
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
      required: true,
      select: false,
    },
    role: {
      required: true,
      type: String,
      enum: USER_ROLES,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSlice',
      default: null,
    },
    resetPasswordToken: String,
  },
  { timestamps: true },
)

if (process.env.NODE_ENV === 'development' && mongoose.models.UserSlice) {
  mongoose.deleteModel('UserSlice')
}

export const UserSlice =
  mongoose.models?.UserSlice || mongoose.model('UserSlice', userSchemaServer)
