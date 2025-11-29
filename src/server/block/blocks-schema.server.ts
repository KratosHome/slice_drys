import mongoose from "mongoose";

const localizedString = {
  en: { type: String, required: false },
  uk: { type: String, required: false },
};

const blockSchema = new mongoose.Schema(
  {
    instagram: {
      title: localizedString,
      description: localizedString,
      url: { type: String, required: false },
    },
    help: {
      title: localizedString,
      content: localizedString,
      button: localizedString,
      link: { type: String, required: false },
      images: { type: [String], required: false },
    },
    mainPartners: {
      title: localizedString,
      partners: [
        {
          name: localizedString,
          website: String,
          logoUrl: String,
        },
      ],
    },
  },
  { timestamps: true },
);

const Block = mongoose.models.Block || mongoose.model("Block", blockSchema);

export default Block;
