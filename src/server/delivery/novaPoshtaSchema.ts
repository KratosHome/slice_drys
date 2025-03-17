import mongoose from 'mongoose'

const novaPoshtaCitiesSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    ref: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
)

export const NovaPoshtaCities =
  mongoose.models.NovaPoshtaCities ||
  mongoose.model('NovaPoshtaCities', novaPoshtaCitiesSchema)

const novaPoshtaDefaultCitiesSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    ref: {
      type: String,
      required: true,
      unique: true,
      ref: 'NovaPoshtaCities',
    },
  },
  { timestamps: true },
)

export const NovaPoshtaDefaultCities =
  mongoose.models.NovaPoshtaDefaultCities ||
  mongoose.model('NovaPoshtaDefaultCities', novaPoshtaDefaultCitiesSchema)

const novaPoshtaBranchesSchema = new mongoose.Schema(
  {
    cityRef: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    branches: [
      {
        _id: false,
        branchRef: {
          type: String,
          required: true,
          unique: true,
        },
        branchName: {
          type: String,
          required: true,
        },
        branchType: {
          type: String,
          // enum: ['Branch', 'Postomat'],
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
)

export const NovaPoshtaBranches =
  mongoose.models.NovaPoshtaBranches ||
  mongoose.model('NovaPoshtaBranches', novaPoshtaBranchesSchema)
