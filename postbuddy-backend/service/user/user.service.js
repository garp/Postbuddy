import { UserModal } from "../../models/user/user.model.js";
import { OtpModel } from "../../models/user/otp.model.js";
import * as dal from "../../dal/dal.js";
import { sendOTP } from "../../utils/sendEmail.js";
import { loginOtpTemplate } from "../../template/email.js";

// Utility function to generate a 6-digit OTP code
const getCode = () => {
  return (
    Math.floor(Math.random() * (9 * Math.pow(10, 6 - 1))) + Math.pow(10, 6 - 1)
  );
};

export const create = async (body) => {
  return dal.create(UserModal, body);
};

export const findById = async (id) => {
  return await dal.findById(UserModal, id);
};

// Search for a customer based on query
export const findOne = async (query) => {
  return await dal.findOne(UserModal, query);
};

export const findOneAndUpdate = async (query, body) => {
  return await dal.findOneAndUpdate(UserModal, query, body);
};

// Validate OTP and delete it from the database
export const validateOTP = async (body) => {
  return await dal.findOneAndDelete(OtpModel, body);
};

// Find a customer and update or insert a record
export const findOneAndUpsert = async (filter, body) => {
  return await dal.findOneAndUpsert(UserModal, filter, body);
};

// Generate an access token for a customer (if found)
export const generateAccessToken = async (filter) => {
  return await dal.findOne(UserModal, filter);
};

export const getOTP = async (filter) => {
  const OTPExists = await dal.findOne(OtpModel, filter);
  const user = await dal.findOne(UserModal, { email: filter.email });

  const subject = "Your Login OTP for Postbuddy";
  if (OTPExists) {
    const code = getCode();
    if (OTPExists.resendCount >= 3) {
      return "Limit exceeded";
    }

    OTPExists.code = code;
    OTPExists.resendCount += 1;

    await OTPExists.save();
    const temp = loginOtpTemplate(user.fullName, code);
    await sendOTP(temp, subject, user.email);
    return "Resent Successfully";
  }

  const code = getCode();
  await dal.create(OtpModel, { ...filter, code, resendCount: 1 });
  console.log(user.fullName, code, subject, user.email);
  const temp = loginOtpTemplate(user.fullName, code);
  await sendOTP(temp, subject, user.email);
  return code;
};

export const update = async (filter, body) => {
  await dal.findOneAndUpdate(UserModal, filter, body);
};

export const findByIdAndUpdate = async (id, body) => {
  return await dal.findByIdAndUpdate(UserModal, id, body);
};

export const orgCommentDetails = async (email) => {
  const query = [
    {
      $match: {
        email: email,
      },
    },
    {
      $lookup: {
        from: "organizations",
        localField: "organizationId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              members: 1,
              orgAdmin: 1,
            },
          },
        ],
        as: "orgDetails",
      },
    },
    {
      $unwind: {
        path: "$orgDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  const org = await aggregate(query);
  return {
    admins: org[0].orgDetails.orgAdmin,
    members: org[0].orgDetails.members,
  };
};

export const brandVoice = async (userId) => {
  const query = [
    {
      $match: {
        _id: userId,
      },
    },
    {
      $lookup: {
        from: "brandvoices",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$userId"] },
              status: "active",
            },
          },
          {
            $project: {
              name: 1,
              summary: 1,
              createdAt: 1,
            },
          },
        ],
        as: "brandVoicesDetails",
      },
    },
    {
      $unwind: {
        path: "$brandVoicesDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  return await dal.aggregate(UserModal, query);
};

export const aggregate = async (filter) => {
  return await dal.aggregate(UserModal, filter);
};
