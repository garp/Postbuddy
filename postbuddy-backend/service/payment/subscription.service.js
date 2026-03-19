import * as dal from "../../dal/dal.js";
import { SubscriptionModel } from "../../models/payment/subscription.model.js";
import axios from "axios";
import { subscriptionActivationTemplate } from "../../template/email.js";
import { sendEmail } from "../../utils/sendEmail.js";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";
const AUTH_HEADER = {
  auth: {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_SECRET,
  },
};

export const create = async (filter, body) => {
  return await dal.create(SubscriptionModel, filter, body);
};

export const findById = async (id) => {
  return await dal.findById(SubscriptionModel, id);
};

export const findOne = async (filter) => {
  return await dal.findOne(SubscriptionModel, filter);
};

export const findAll = async (filter, sort) => {
  return await dal.findAll(SubscriptionModel, filter, sort);
};

export const findOneAndUpdate = async (filter, body) => {
  return await dal.findOneAndUpdate(SubscriptionModel, filter, body);
};

export const findByIdAndUpdate = async (id, body) => {
  return await dal.findByIdAndUpdate(SubscriptionModel, id, body);
};

export const remove = async (filter) => {
  return await dal.findOneAndDelete(SubscriptionModel, filter);
};

export const deleteById = async (id) => {
  return await dal.deleteById(SubscriptionModel, id);
};

export const aggregate = async (query, sort) => {
  return await dal.aggregate(SubscriptionModel, query, sort);
};

export const updateMany = async (filter, body) => {
  return await dal.updateMany(SubscriptionModel, filter, body);
};

export const createBasicSubscription = async (basicPlan, user) => {
  const body = {
    userId: user._id,
    planId: basicPlan._id,
    gatewaySubscriptionId: "sub_basic",
    status: "active",
  };
  const subscription = await create(body);
  if (!subscription) {
    return errorHandler("ERR_SUBSCRIPTION_CREATION_FAILED", res);
  }
  console.log("Subscription created successfully");
};

export const cancelSubscription = async (gatewaySubscriptionId) => {
  try {
    console.log("Gateway Subscription ID ==>", gatewaySubscriptionId);
    const response = await axios.post(
      `${RAZORPAY_API_BASE}/subscriptions/${gatewaySubscriptionId}/cancel`,
      {},
      AUTH_HEADER
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

class SubscriptionHandlerClass {
  async inActiveCurrentSubscription(userId) {
    const currentSubscription = await findOne({
      status: "active",
      userId: userId,
    });
    console.log("Current Subscription ==> ", currentSubscription);

    if (!currentSubscription) {
      return;
    }

    if (currentSubscription.gatewaySubscriptionId === "sub_basic") {
      await findByIdAndUpdate(currentSubscription._id, { status: "inactive" });
    } else if (currentSubscription.gatewaySubscriptionId !== "sub_lifetime") {
      try {
        await cancelSubscription(currentSubscription.gatewaySubscriptionId);
        await findByIdAndUpdate(currentSubscription._id, {
          status: "inactive",
        });
      } catch (error) {
        throw new Error(`Failed to cancel subscription: ${error.message}`);
      }
    }
  }

  async activatePendingSubscription(id, user) {
    const subscription = await findById(id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    // Send email to user if subscription is lifetime
    if (subscription.gatewaySubscriptionId === "sub_lifetime") {
      const date = new Date(subscription.createdAt);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      const emailTemplate = subscriptionActivationTemplate(
        user.fullName,
        "Lifetime",
        formattedDate
      );
      await sendEmail(
        emailTemplate,
        "Your PostBuddy Subscription is Now Active!",
        user.email
      );
      console.log(`Subscription activation email sent to ${user.email}`);
    }
    return await findByIdAndUpdate(subscription._id, { status: "active" });
  }

  async sendSubscriptionActivationEmail(user, transaction, subscription) {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    const emailContent = subscriptionActivationTemplate(
      user.fullName,
      transaction.gatewaySubscriptionId,
      formattedDate
    );

    await sendEmail(
      emailContent,
      "Your postbuddy Subscription is Now Active!",
      user.email
    );
  }
}

export default new SubscriptionHandlerClass();
