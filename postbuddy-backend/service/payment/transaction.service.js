import * as dal from "../../dal/dal.js";
import { TransactionModel } from "../../models/payment/transaction.model.js";
import TransactionQuery from "../../query/payment/transaction.js";
// Create a new transaction
export const create = async (body, call) => {
  console.log("Transaction Body ==> ", call, body);
  return await dal.create(TransactionModel, body);
};

// Search for a transaction
export const findOne = async (filter) => {
  return await dal.findOne(TransactionModel, filter);
};

// Find and update a transaction
export const findOneAndUpdate = async (filter, body) => {
  return await dal.findOneAndUpdate(TransactionModel, filter, body);
};

export const findByIdAndUpdate = async (id, body) => {
  return await dal.findByIdAndUpdate(TransactionModel, id, body);
};

// Update transaction by Razorpay order ID
export const updateByOrderId = async (orderId, updateData) => {
  return await dal.findOneAndUpdate(
    TransactionModel,
    { razorpay_order_id: orderId }, // Filter by Razorpay order ID
    updateData // Update fields
  );
};

export const verifyTransaction = async (gatewayPaymentId) => {
  const query = TransactionQuery.verifyTransactionQuery(gatewayPaymentId);
  const transaction = await dal.aggregate(TransactionModel, query);
  return transaction[0];
};

export const findAll = async (filter) => {
  return await dal.findAll(TransactionModel, filter);
};

export const subscriptionType = (razorpay_order_id) => {
  if (razorpay_order_id && razorpay_order_id.includes("sub_")) {
    return "subscription";
  } else {
    return "order";
  }
};

export const buildTransactionBody = ({
  user,
  subscription,
  gatewaySubscriptionId,
  paymentId,
}) => {
  return {
    userId: user._id,
    subscriptionId: subscription._id,
    gatewaySubscriptionId,
    amount: subscription.amount,
    gatewayPaymentId: paymentId,
    status: "success",
    transactionType: "credited",
    subscriptionActivation: gatewaySubscriptionId === "sub_lifetime",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
