import mongoose from "mongoose";

const plansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["india", "global"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    gatewayPlanId: {
      type: String,
    },
    gateway: {
      type: String,
      enum: ["stripe", "paypal", "razorpay"],
      required: true,
    },
    period: {
      type: String,
      enum: ["basic", "monthly", "yearly", "lifetime"],
    },
    interval: {
      type: Number,
    },
    currency: {
      type: String,
      required: true,
    },
    razorpayDetails: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export const PlansModel = mongoose.model("Plan", plansSchema);
