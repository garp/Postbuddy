import axios from "axios";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";
import * as SubscriptionService from "../../service/payment/subscription.service.js";
import * as PlanService from "../../service/payment/plan.service.js";
import * as WebhookService from "../../service/webhook.js";
import * as UserService from "../../service/user/user.service.js";
import * as TransactionService from "../../service/payment/transaction.service.js";
import crypto from "crypto";
import TransactionQuery from "../../query/payment/transaction.js";
import { ObjectId } from "mongodb";
import SubscriptionHandlerClass from "../../service/payment/subscription.service.js";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";
const AUTH_HEADER = {
  auth: {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_SECRET,
  },
};

// Helper functions
const determineSubscriptionType = (orderId) => {
  return TransactionService.subscriptionType(orderId) === "subscription"
    ? orderId
    : "sub_lifetime";
};

const buildTransactionBody = ({
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
    webhookVerificationStatus: "pending",
  };
};

function verifySignature(reqBody) {
  try {
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id,
      razorpay_subscription_id,
    } = reqBody;

    let payload;
    if (razorpay_order_id) {
      // For lifetime (Order flow) - order_id|payment_id
      payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    } else if (razorpay_subscription_id) {
      // For monthly (Subscription flow) - payment_id|subscription_id
      payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    } else {
      console.error("Missing required parameters for signature verification");
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(payload)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) {
      console.error("Signature verification failed", {
        expected: expectedSignature,
        received: razorpay_signature,
        payload,
      });
    }

    return isValid;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

const createOrder = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const { planId } = req.body;

    if (!planId) {
      return responseHandler(null, res, "Invalid planId", 400);
    }

    const plan = await PlanService.findOne({ _id: planId });
    if (!plan) {
      return responseHandler(null, res, "Plan not found", 400);
    }

    const user = await UserService.findById(id);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }

    // Lifetime Subscription Checkout
    console.log("Selected Plan ==> ", plan);
    if (plan.gatewayPlanId === "plan_lifetime") {
      const checkoutBody = {
        amount: plan.price || 399900,
        currency: plan.currency || "INR",
        partial_payment: false,
      };
      const checkout = await axios.post(
        `${RAZORPAY_API_BASE}/orders`,
        checkoutBody,
        AUTH_HEADER
      );

      const checkoutData = {
        id: checkout.data.id,
        entity: checkout.data.entity,
        amount: checkout.data.amount,
        currency: checkout.data.currency,
        status: checkout.data.status,
      };
      const body = {
        userId: id,
        planId: plan._id,
        gatewaySubscriptionId: "sub_lifetime",
        gatewayOrderId: checkout.data.id,
        status: "created",
        amount: plan.price,
      };

      const createdSub = await SubscriptionService.create(body);
      console.log("Subscription saved to DB:", createdSub);

      return responseHandler(
        checkoutData,
        res,
        "Successfully created lifetime plan checkout"
      );
    }

    // Monthly Subscription Checkout
    const subscriptionBody = {
      plan_id: plan.gatewayPlanId,
      total_count: 120,
      quantity: 1,
      notes: {
        id: user._id,
        email: user.email,
      },
    };
    console.log("Subscription Body ==> ", subscriptionBody);

    const subscriptionResponse = await axios.post(
      `${RAZORPAY_API_BASE}/subscriptions`,
      subscriptionBody,
      AUTH_HEADER
    );
    const body = {
      userId: id,
      planId: plan._id,
      gatewaySubscriptionId: subscriptionResponse.data.id,
      status: subscriptionResponse.data.status,
      amount: plan.price,
    };

    const subs = await SubscriptionService.create(body);
    console.log("Subscription saved to DB:", subs);
    responseHandler(
      subscriptionResponse.data.id,
      res,
      "Checkout order created"
    );
  } catch (error) {
    console.error("Error Creating Order:", error);
    errorHandler(error, res);
  }
};

const createTransaction = async (req, res) => {
  try {
    const reqBody = req.body;
    // Input validation
    if (!reqBody) {
      return responseHandler(null, res, "Request body is required", 400);
    }
    // Signature verification
    if (!verifySignature(reqBody)) {
      return responseHandler(null, res, "Invalid signature", 400);
    }
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }

    let filter = {
      userId,
      status: { $in: ["created", "active"] },
    };

    if (reqBody.razorpay_order_id) {
      filter["gatewayOrderId"] = reqBody.razorpay_order_id;
    }
    if (reqBody.razorpay_subscription_id) {
      filter["gatewaySubscriptionId"] = reqBody.razorpay_subscription_id;
    }

    console.log("Filter ==> ", JSON.stringify(filter));

    const subscription = await SubscriptionService.findOne(filter);
    console.log("Subscription ==> ", subscription);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Inactive Basic Subscription
    await SubscriptionHandlerClass.inActiveCurrentSubscription(userId);

    const updatedSubscription =
      await SubscriptionHandlerClass.activatePendingSubscription(
        subscription._id
      );

    console.log("Updated Subscription ==> ", updatedSubscription);

    const existingTransaction = await TransactionService.findOne({
      gatewayPaymentId: reqBody.razorpay_payment_id,
      userId,
      subscriptionId: updatedSubscription._id,
    });
    console.log("Existing Transaction ==> ", existingTransaction);
    if (existingTransaction) {
      const updatedTransaction = await TransactionService.findByIdAndUpdate(
        existingTransaction._id,
        {
          webhookVerificationStatus: "success",
        }
      );
      console.log("Updated Transaction ==> ", updatedTransaction);
      return responseHandler(
        null,
        res,
        "Transaction verified successfully",
        200
      );
    }

    const transactionBody = {
      userId,
      subscriptionId: updatedSubscription._id,
      gatewayPaymentId: reqBody.razorpay_payment_id,
      gatewaySubscriptionId: updatedSubscription.gatewaySubscriptionId,
      gatewayOrderId: updatedSubscription.gatewayOrderId,
      amount: updatedSubscription.amount,
      status: "success",
      transactionType: "credited",
      subscriptionActivation:
        updatedSubscription.gatewaySubscriptionId === "sub_lifetime",
      webhookVerificationStatus: "pending",
    };
    const transaction = await TransactionService.create(transactionBody);
    console.log("Created Transaction ==> ", transaction);
    return responseHandler(null, res, "Transaction created successfully", 200);
  } catch (error) {
    console.error("Error in createTransaction:", error);
    return errorHandler(
      error.message || "Internal server error",
      res,
      error.statusCode || 500
    );
  }
};

const verifyWebhook = async (req, res) => {
  try {
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || "MySecureWebhook123";

    if (!WebhookService.verifySignature(req, res, webhookSecret)) {
      return console.log("Signature not verified");
    }
    const webhookEvent = req.body;
    console.log("Webhook event: " + webhookEvent.event);
    switch (webhookEvent.event) {
      case "payment.captured":
        console.log("Payment captured");
        WebhookService.paymentCaptured(webhookEvent);
        break;
      case "subscription.activated":
        console.log("Subscription activated");
        WebhookService.subscriptionActivated(webhookEvent);
        break;
      case "subscription.cancelled":
        console.log("Subscription cancelled");
        WebhookService.subscriptionCancelled(webhookEvent);
        break;
      case "subscription.charged":
        console.log("Subscription charged");
        WebhookService.subscriptionCharged(webhookEvent);
        break;
      default:
        console.log("Unknown event");
        WebhookService.unknownEvent(webhookEvent);
        break;
    }

    responseHandler({ message: "Webhook processed successfully" }, res, 200);
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    errorHandler("ERR_INTERNAL_SERVER", res);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    const transactions = await TransactionService.findAll({ userId });
    responseHandler(transactions, res, "All transactions fetched successfully");
  } catch (error) {
    console.error("Error fetching transactions:", error);
    errorHandler("ERR_INTERNAL_SERVER", res);
    throw new Error(error);
  }
};

const verifyTransaction = async (req, res) => {
  try {
    const { gatewayPaymentId } = req.query;
    if (!gatewayPaymentId) {
      return responseHandler(null, res, "Gateway payment ID is required", 400);
    }
    const transaction = await TransactionService.verifyTransaction(
      gatewayPaymentId
    );
    responseHandler(transaction, res, "Transaction verified successfully");
  } catch (error) {
    console.error("Error verifying transaction:", error);
    errorHandler("ERR_INTERNAL_SERVER", res);
  }
};

export {
  createOrder,
  verifyWebhook,
  getAllTransactions,
  verifyTransaction,
  createTransaction,
};
