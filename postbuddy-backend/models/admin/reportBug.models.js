import mongoose from 'mongoose';

const reportBugSchema = new mongoose.Schema(
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
      enum: ["linkedin", "twitter", "facebook", "instagram", "youtube"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    stepsToReproduce: {
      type: String,
    },
    expectedResult: {
      type: String,
    },
    actualResult: {
      type: String,
    },
    url: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
    },
    mediaUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ReportBug = mongoose.model('ReportBug', reportBugSchema);
