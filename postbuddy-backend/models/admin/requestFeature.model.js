import mongoose from 'mongoose';

const requestFeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const RequestFeature = mongoose.model('requestfeature', requestFeatureSchema);
