import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: 'users',
      required: true,
    },
    gatewayOrderId:{
      type: String,
    },
    planId: {
      type: Schema.ObjectId,
      ref: 'plans',
      required: true,
    },
    gatewaySubscriptionId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'inactive', 'created'],
    },

    notes: {
      type: Map,
      of: String,
    },
    cancellationReason: {
      type: String,
    }
  },
  { timestamps: true }
);

export const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);
