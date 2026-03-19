
import mongoose from 'mongoose';

const talkToSalesSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    teamSize: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

export const TalkToSales = mongoose.model('talktosales', talkToSalesSchema);
