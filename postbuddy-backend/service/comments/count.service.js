import * as dal from "../../dal/dal.js";
import { Count } from "../../models/comment/count.model.js";
import { UserModal } from "../../models/user/user.model.js";
import cron from "node-cron";
import { dailyLimitReachedTemplate } from "../../template/email.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const findById = async (id) => {
  return await dal.findById(Count, id);
};

export const create = async (body) => {
  return await dal.create(Count, body);
};

export const findOne = async (filter) => {
  return await dal.findOne(Count, filter);
};

export const findOneAndUpdate = async (filter, body) => {
  return await dal.findOneAndUpdate(Count, filter, body);
};

export const aggregate = async (filter) => {
  return await dal.aggregate(Count, filter);
};

export const incCount = async (id) => {
  const user = await dal.findById(UserModal, id);
  if (!user) {
    return "User not found";
  }
  if (user.role === "admin") {
    console.log("Admin generated this comment");
    const countDoc = await dal.findOne(Count, { userId: user._id });
    if (!countDoc) {
      return await dal.create(Count, { userId: user._id, count: 1 });
    }
    return await dal.findOneAndUpdate(
      Count,
      { userId: user._id },
      { $inc: { count: 1 } }
    );
  }
  const countDoc = await dal.findOne(Count, { userId: user._id });
  if (!countDoc) {
    return await dal.create(Count, { userId: user._id, count: 1 });
  }
  if (countDoc.count >= 10) {
    const temp = dailyLimitReachedTemplate(user.fullName);
    const subject = "Daily Comment Limit Reached for Postbuddy";
    await sendEmail(temp, subject, user.email);
    return "Daily limit reached";
  }
  return await dal.findOneAndUpdate(
    Count,
    { userId: user._id },
    { $inc: { count: 1 } }
  );
};

cron.schedule(
  "30 17 * * *",
  async () => {
    try {
      console.log("Clearing all documents in the 'counts' collection...");
      await dal.deleteAll(Count);
      console.log("All documents cleared successfully.");
    } catch (error) {
      console.error("Error clearing 'counts' collection:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

export const recreateCountUpdate = async (id) => {
  const user = await dal.findById(UserModal, id);
  if (!user) {
    return "User not found";
  }
  if (user.role === "admin") {
    console.log("Admin generated this comment");
  }
  const count = await dal.findOne(Count, { userId: id });
  if (!count) {
    return await dal.create(Count, { userId: id, count: 3 });
  }
  return await dal.findOneAndUpdate(
    Count,
    { userId: id },
    { $inc: { count: 3 } }
  );
};

export const checkCount = async (type, id) => {
  const user = await dal.findById(UserModal, id);
  if (!user) {
    return "User not found";
  }
  if (type === "chat" || type === "comment") {
    const count = await dal.findOneAndUpsert(Count, { userId: id }, { count: 0 });
    if (count.count > 9) {
      return "Daily limit reached";
    }
    return "User has enough credits";
  } else if (type === "recreate") {
    const count = await dal.findOneAndUpsert(Count, { userId: id }, { count: 0 });
    if (count.count > 7) {
      return "Daily limit reached";
    }
    return "User has enough credits";
  }
  return "User has enough credits";
};
