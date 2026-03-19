import * as SubscriptionService from "../../service/payment/subscription.service.js";
import * as TransactionService from "../../service/payment/transaction.service.js";
import * as UserService from "../../service/user/user.service.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";
import * as queries from "../../query/payment/subscription.js";
import axios from "axios";
import { ObjectId } from "mongodb";
import { subscriptionCancellationTemplate } from "../../template/email.js";
import { sendEmail } from "../../utils/sendEmail.js";
import * as SubscriptionQueries from "../../query/payment/subscription.js";

export const findSubscription = async (req, res) => {
  try {
    const reqQuery = req.query;
    const { _id: id } = req.user;
    const user = await UserService.findById(id);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    let filter = {};
    const userId = new ObjectId(reqQuery.customerId);
    const status = reqQuery.status;
    filter = { ...filter, userId: user._id, status: "active" };
    const query = queries.subscriptionQuery(filter);
    console.log("Query ==> ", JSON.stringify(query));
    const subscription = await SubscriptionService.aggregate(query);
    if (!subscription) {
      return responseHandler(null, res, "Subscription not found.", 404);
    }

    return responseHandler(
      subscription,
      res,
      "Subscription retrieved successfully."
    );
  } catch (error) {
    console.error("Error finding subscription:", error.message);
    errorHandler(
      error.message || "Internal Server Error",
      res,
      error.statusCode || 500
    );
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { reason } = req.query;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, 401);
    }
    const subscription = await SubscriptionService.findOne({
      userId: userId,
      status: "active",
      gatewaySubscriptionId: { $ne: "sub_basic" },
    });
    if (subscription && reason) {
      subscription.cancellationReason = reason;
    }
    if (!subscription) {
      return responseHandler(null, res, "No active subscription found", 404);
    }
    subscription.status = "cancelled";
    await subscription.save();
    const checkPremiumPlan = await SubscriptionService.findOne({
      userId: userId,
      status: "inactive",
      gatewaySubscriptionId: { $ne: "sub_basic" },
    });
    if (checkPremiumPlan) {
      checkPremiumPlan.status = "active";
      checkPremiumPlan.save();
    } else {
      const checkBasicPlan = await SubscriptionService.findOne({
        userId: userId,
        status: "inactive",
        gatewaySubscriptionId: { $eq: "sub_basic" },
      });
      checkBasicPlan.status = "active";
      checkBasicPlan.save();
    }
    if (subscription.gatewaySubscriptionId === "sub_lifetime") {
      const filter = {
        subscriptionId: subscription._id,
        subscriptionActivation: true,
      };
      const transaction = await TransactionService.findOne(filter);

      if (!transaction) {
        return errorHandler("Transaction not valid", res, 404);
      }

      const refund = await axios.post(
        `https://api.razorpay.com/v1/payments/${transaction.gatewayPaymentId}/refund`,
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
        paymentMethod: transaction.paymentMethod,
        status: "success",
        subscriptionActivation: false,
        transactionType: "debited",
        parentTransactionId: transaction._id,
      };
      const newTransaction = await TransactionService.create(
        transactionBody,
        "cancelSubscriptionFn"
      );

      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      const temp = subscriptionCancellationTemplate(
        user.fullName,
        transactionBody.gatewaySubscriptionId,
        formattedDate,
        transactionBody.amount / 100
      );
      const subject = "Your postbuddy Subscription is Cancelled!";
      await sendEmail(temp, subject, user.email);
    } else {
      const filter = {
        subscriptionId: subscription._id,
        subscriptionActivation: true,
      };
      const transaction = await TransactionService.findOne(filter);
      if (!transaction) {
        return responseHandler(null, res, "Please try again after 10 min", 201);
      }
      const refund = await axios.post(
        `https://api.razorpay.com/v1/subscriptions/${subscription.gatewaySubscriptionId}/cancel`,
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
        amount: transaction.amount,
        gatewayPaymentId: refund.data.id,
        currency: refund.data.currency,
        paymentMethod: transaction.paymentMethod,
        status: "success",
        subscriptionActivation: true,
        transactionType: "debited",
        parentTransactionId: transaction._id,
      };
      const newTransaction = await TransactionService.create(
        transactionBody,
        "cancelSubscriptionFn"
      );
      const checkBasicPlan = await SubscriptionService.findOne({
        userId: userId,
        gatewaySubscriptionId: { $eq: "sub_basic" },
      });
      checkBasicPlan.status = "active";
      checkBasicPlan.save();

      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      const temp = subscriptionCancellationTemplate(
        user.fullName,
        transactionBody.gatewaySubscriptionId,
        formattedDate,
        transactionBody.amount / 100
      );
      const subject = "Your postbuddy Subscription is Cancelled!";
      await sendEmail(temp, subject, user.email);
    }
    responseHandler(null, res, "Subscription cancelled", 201);
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    errorHandler(
      error.message || "Internal Server Error",
      res,
      error.statusCode || 500
    );
  }
};

export const subscriptionActive = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }

    const filter = {
      userId: user._id,
      status: "active",
      gatewaySubscriptionId: {
        $ne: "sub_basic",
      },
    };
    const query = SubscriptionQueries.activeSubscription(filter);

    const data = await SubscriptionService.aggregate(query);
    // console.log("Data ==> ", data?.[0]?.transactions.subscriptionActivation)
    if (!data?.[0]?.transactions.subscriptionActivation) {
      return responseHandler(
        false,
        res,
        "Subscription is not activated at the moment",
        201
      );
    }

    responseHandler(
      data?.[0]?.transactions.subscriptionActivation,
      res,
      "Subscription is activated at the moment",
      201
    );
  } catch (error) {
    console.log("Subscription Activation error : ", error),
      errorHandler(error.message || "ACTIVE_SUBSCRIPTION_ERROR", res);
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const reqQuery = req.query;
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }

    let filter = {};

    if (reqQuery.gatewaySubscriptionId) {
      filter.gatewaySubscriptionId = reqQuery.gatewaySubscriptionId;
    } else if (reqQuery.gatewayOrderId) {
      filter.gatewayOrderId = reqQuery.gatewayOrderId;
    }

    const subscription = await SubscriptionService.findOne(filter);
    console.log("Subscription ==> ", subscription);
    if (!subscription) {
      return responseHandler(null, res, "Subscription not found", 404);
    }

    await SubscriptionService.deleteById(subscription._id);
    return responseHandler(null, res, "Subscription deleted successfully", 201);
  } catch (error) {
    console.log("Delete Subscription error : ", error);
    errorHandler(error.message || "DELETE_SUBSCRIPTION_ERROR", res);
  }
};
