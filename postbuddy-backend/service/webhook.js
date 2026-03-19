// Services
import * as TransactionService from "./payment/transaction.service.js";
import * as SubscriptionService from "./payment/subscription.service.js";
import * as UserService from "../service/user/user.service.js";
import crypto from "crypto";
import axios from "axios";
import dayjs from "dayjs";
import { responseHandler } from "../utils/responseHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { subscriptionCancellationTemplate, subscriptionChargedTemplate, subscriptionActivationTemplate } from "../template/email.js";
import SubscriptionHandlerClass from "./payment/subscription.service.js";

// Verufy Signature
export const verifySignature = (req, res, webhookSecret) => {
  if (!webhookSecret) {
    console.error("Webhook secret is not configured.");
    responseHandler(null, res, "Webhook secret not configured", 500);
    return false;
  }

  const razorpaySignature = req.headers["x-razorpay-signature"];
  if (!razorpaySignature) {
    responseHandler(null, res, "Missing Razorpay signature", 500);
    return false;
  }

  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (razorpaySignature !== expectedSignature) {
    console.error("Invalid webhook signature");
    responseHandler(null, res, "Invalid webhook signature", 400);
    return false;
  }

  return true; // Signature is valid
};
// Payments
export const paymentCaptured = async (webhookEvent) => {
  try {
    // Validate input
    if (!webhookEvent?.payload?.payment?.entity) {
      throw new Error("Invalid webhook event structure");
    }

    const payload = webhookEvent.payload.payment.entity;
    const { contact, id: paymentId, notes, order_id } = payload;

    // Find and update user with contact if missing
    const user = await UserService.findById(notes.userId);
    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    if (contact && !user.contact) {
      await UserService.findOneAndUpdate(
        { _id: user._id },
        { contact: contact }
      );
    }

    let filter = {
      userId: user._id,
      status: { $in: ["created", "active"] },
    };

    if (order_id && !notes.gatewaySubscriptionId) {
      filter["gatewayOrderId"] = order_id;
    }
    else if (notes.gatewaySubscriptionId) {
      filter["gatewaySubscriptionId"] = notes.gatewaySubscriptionId;
    }

    console.log("Webhook Filter ==> ", JSON.stringify(filter));
    const subscription = await SubscriptionService.findOne(filter);
    console.log("Subscription ==> ", subscription);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await SubscriptionHandlerClass.inActiveCurrentSubscription(user._id);

    const updatedSubscription =
      await SubscriptionHandlerClass.activatePendingSubscription(
        subscription._id,user
      );
    console.log("Webhook Updated Subscription ==> ", updatedSubscription);

    const existingTransaction = await TransactionService.findOne({
      gatewayPaymentId: paymentId,
      userId: user._id,
      subscriptionId: updatedSubscription._id,
    });
    console.log("Webhook Existing Transaction ==> ", existingTransaction);

    if (existingTransaction) {
      const updatedTransaction = await TransactionService.findByIdAndUpdate(
        existingTransaction._id,
        {
          webhookVerificationStatus: "success",
        }
      );
      console.log("Webhook Updated Transaction ==> ", updatedTransaction);
      return responseHandler(null, res, "Transaction already exists", 400);
    }

    const transactionBody = {
      userId: user._id,
      subscriptionId: updatedSubscription._id,
      gatewayPaymentId: paymentId,
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
    console.log("Webhook Created Transaction ==> ", transaction);

    console.log("Payment captured and processed successfully");
  } catch (error) {
    console.error("Error in paymentCaptured webhook:", error.message);
    throw error;
  }
};

export const paymentFailed = async (webhookEvent) => {
  try {
  } catch (error) {}
};

// Subscriptions
export const subscriptionActivated = async (webhookEvent) => {
  try {
    const subscriptionPayload = webhookEvent.payload.subscription.entity;
    const paymentPayload = webhookEvent.payload.payment.entity;
    
    let filter = {
      gatewaySubscriptionId: subscriptionPayload.id,
      gatewayPaymentId: paymentPayload.id,
      subscriptionActivation: false,
    };

    const transaction = await TransactionService.findAll(filter);
    await TransactionService.findOneAndUpdate(filter, {
      subscriptionActivation: true,
    });
    
    // Retrieve subscription from database
    const subscription = await SubscriptionService.findOne({
      gatewaySubscriptionId: subscriptionPayload.id,
    });
    
    if (!subscription) {
      console.error(`Subscription not found for gateway ID: ${subscriptionPayload.id}`);
      throw new Error("Subscription not found");
    }
    
    // Get user associated with subscription
    const user = await UserService.findById(subscription.userId);
    if (!user) {
      console.error(`User not found for ID: ${subscription.userId}`);
      throw new Error("User not found");
    }
    
    const activationDate = new Date(paymentPayload.created_at * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const planName = subscription.planDetails?.name || "Premium";
    
    // Create email using the subscriptionActivationTemplate
    const emailTemplate = subscriptionActivationTemplate(
      user.fullName, 
      planName, 
      activationDate
    );
    
    const subject = "Your PostBuddy Subscription is Now Active!";
    
    // Send the email
    const emailResult = await sendEmail(emailTemplate, subject, user.email);
    console.log(`Subscription activation email sent to ${user.email}`);
    
    return { success: true, emailSent: true };
  } catch (error) {
    console.error(`Error processing subscription activation: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Next month payment
export const subscriptionCharged = async (webhookEvent) => {
  try {
    // Extract relevant data from webhook event
    const subscriptionPayload = webhookEvent.payload.subscription.entity;
    const paymentPayload = webhookEvent.payload.payment.entity;
    
    // Retrieve subscription from database
    const subscription = await SubscriptionService.findOne({
      gatewaySubscriptionId: subscriptionPayload.id,
    });
    
    if (!subscription) {
      console.error(`Subscription not found for gateway ID: ${subscriptionPayload.id}`);
      throw new Error("Subscription not found");
    }
    
    // Get user associated with subscription
    const user = await UserService.findById(subscription.userId);
    if (!user) {
      console.error(`User not found for ID: ${subscription.userId}`);
      throw new Error("User not found");
    }
    
    const chargeDate = new Date(paymentPayload.created_at * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const nextBillingDate = new Date(paymentPayload.created_at * 1000);
    nextBillingDate.setDate(nextBillingDate.getDate() + 30);
    const formattedNextBillingDate = nextBillingDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const amount = paymentPayload.amount / 100;
    const planName = subscription.planDetails?.name || "Premium";
    
    const emailTemplate = subscriptionChargedTemplate(
      user.fullName, 
      planName, 
      amount, 
      chargeDate, 
      formattedNextBillingDate
    );
    
    const subject = "Your PostBuddy Subscription Payment Confirmation";
    
    const emailResult = await sendEmail(emailTemplate, subject, user.email);
    console.log(`Payment confirmation email sent to ${user.email}`);
    
    return { success: true, emailSent: true };
  } catch (error) {
    console.error(`Error processing subscription charge: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const subscriptionCancelled = async (webhookEvent) => {
  try {
    const payload = webhookEvent.payload.subscription.entity;
    const subscriptionId = webhookEvent.payload.subscription.entity.id;
    const subscription = await SubscriptionService.findOne({
      gatewaySubscriptionId: subscriptionId,
      status: { $ne: "cancelled" },
    });
    await SubscriptionService.findOneAndUpdate(
      { _id: subscription._id },
      { status: "cancelled" }
    );
    const user = await UserService.findById(subscription.userId);

    const subscriptionCreationDate = dayjs(subscription.createdAt);
    const currentDate = dayjs();
    const daysSinceCreation = currentDate.diff(subscriptionCreationDate, "day");

    if (daysSinceCreation <= 7) {
      const transaction = await TransactionService.findOne({
        subscriptionId: subscription._id,
      });
      const paymentId = transaction.gatewayPaymentId;

      // Initiate refund
      const refund = await axios.post(
        `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
        { cancel_at_cycle_end: 0 },
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_SECRET,
          },
        }
      );
      const transactionBody = {
        userId: transaction.userId,
        subscriptionId: subscription._id,
        gatewaySubscriptionId: subscription.gatewaySubscriptionId,
        amount: refund.data.amount,
        gatewayPaymentId: refund.data.id,
        currency: refund.data.currency,
        paymentMethod: payload.payment_method,
        status: "success",
        subscriptionActivation: false,
        transactionType: "debited",
        parentTransactionId: transaction._id,
      };
      const newTransaction = await TransactionService.create(
        transactionBody,
        "subscriptionCancelledFn"
      );
      console.log("Transaction created : ", newTransaction);
      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      const temp = subscriptionCancellationTemplate(
        user.fullName,
        transactionBody.gatewaySubscriptionId,
        formattedDate
      );
      const subject = "Your postbuddy Subscription is Cancelled!";
      await sendEmail(temp, subject, user.email);
    } else {
      console.log(
        `Subscription ${subscriptionId} is older than 7 days. No refund initiated.`
      );
    }
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
};

export const subscriptionCompleted = async (webhookEvent) => {
  try {
  } catch (error) {}
};

export const subscriptionResumed = async (webhookEvent) => {
  try {
  } catch (error) {}
};

export const subscriptionPending = async (webhookEvent) => {
  try {
  } catch (error) {}
};

export const unknownEvent = async (webhookEvent) => {
  console.log("Webhook event : ", webhookEvent.event);
};
