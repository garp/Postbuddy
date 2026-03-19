import mongoose, { Schema } from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: 'users',
      required: true,
    },
    subscriptionId: {
      type: Schema.ObjectId,
      ref: 'subscriptions',
    },
    gatewaySubscriptionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    gatewayPaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      enum: ['USD', 'INR'],
      default: 'INR',
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending',],
      default: 'pending',
    },
    webhookVerificationStatus: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
    subscriptionActivation: {
      type: Boolean,
      default: false,
    },
    transactionType: {
      type: String,
      enum: ['credited', 'debited'],
      required: true,
    },
    parentTransactionId: {
      type: Schema.ObjectId,
      ref: "transactions"
    }
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model('Transaction', transactionSchema);
