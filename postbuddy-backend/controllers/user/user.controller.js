import { generateToken } from "../../utils/generateToken.js";
import { responseHandler, errorHandler } from "../../utils/responseHandler.js";
import * as UserService from "../../service/user/user.service.js";
import * as SubscriptionService from "../../service/payment/subscription.service.js";
import * as PlanService from "../../service/payment/plan.service.js";
import OrganizationService from "../../service/user/organization.service.js";
import {
  registrationSuccessTemplate,
  organizationRegistrationSuccessTemplate,
} from "../../template/email.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateIDs, generateInviteLink } from "../../utils/helper.js";
import chalk from "chalk";

const createOrganization = async (body) => {
  try {
    const organization = await OrganizationService.create(body);
    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    errorHandler("ERR_ORGANIZATION_CREATION_FAILED", res);
  }
};

//Login with OTP
export const loginWithOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if email or type is missing
    if (!email) {
      return responseHandler(null, res, "Email is required", 400);
    }
    const user = await UserService.findOne({ email: email });
    if (!user) {
      const userBody = {
        fullName: email.split("@")[0],
        email: email,
      };
      const newUser = await UserService.create(userBody);
      let filter = { email: newUser.email, purpose: "register" };
      const otp = await UserService.getOTP(filter);
      if (otp === "Limit exceeded") {
        return responseHandler(null, res, "Try again after 10 mins", 429);
      }
      return responseHandler(
        { purpose: "register", isVerified: newUser.isVerified },
        res,
        "Verify account",
        200
      );
    } else {
      let filter = { email, purpose: "login" };
      const otp = await UserService.getOTP(filter);
      if (otp === "Limit exceeded") {
        return responseHandler(null, res, "Try again after 10 mins", 429);
      }
    }
    responseHandler(
      {
        purpose:
          user.isVerified || user.inviteStatus === "pending"
            ? "login"
            : "register",
        isVerified: user.isVerified,
      },
      res,
      "Verify account",
      200
    );
  } catch (error) {
    console.log(error);
    errorHandler("ERR_INTERNAL_SERVER", res, 500);
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    let { email, code, fullName, type, organizationName } = req.value;
    console.log("req.value ==> ", req.value);

    const otpFilter = { email, code };
    const otp = await UserService.validateOTP(otpFilter);

    if (!otp) {
      return responseHandler(null, res, "Invalid Otp", 400);
    }

    console.log(chalk.green("OTP verified successfully"));

    const user = await UserService.findOne({ email });
    if (!user) {
      return responseHandler(null, res, "User not found", 404);
    }
    if (fullName === "") {
      fullName = user.fullName;
    }

    if (user.isVerified === false) {
      if (type === "organization") {
        const orgId = generateIDs();
        const body = {
          organizationName: organizationName,
          organizationId: orgId,
          email: email,
          orgAdmin: [user._id],
        };
        const org = await createOrganization(body);
        console.log(chalk.green("Organization created successfully"));
        await UserService.findByIdAndUpdate(user._id, {
          organizationId: org._id,
          role: "orgAdmin",
          type: "organization",
        });
        console.log(chalk.green("User role updated successfully"));
      }
      // Update invite status to accepted
      await UserService.findOneAndUpdate(
        { email: email, inviteStatus: "pending" },
        { inviteStatus: "accepted" }
      );
      const existingSubscription = await SubscriptionService.findOne({
        userId: user._id,
      });
      if (!existingSubscription) {
        const basicPlan = await PlanService.findOne({
          gatewayPlanId: "plan_basic",
        });
        await SubscriptionService.createBasicSubscription(basicPlan, user);
      }
      const payload = {
        email: user.email,
        fullName: fullName || user.email.split("@")[0],
        _id: user._id,
        profileUrl:
          user.profileUrl ||
          `https:/api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
      };
      const token = generateToken(payload);
      await UserService.update(
        { email },
        {
          fullName: fullName,
          profileUrl: `https:/api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
          status: "active",
          isVerified: true,
        }
      );
      if (user.role === "orgAdmin") {
        const org = await OrganizationService.update(
          {
            organizationId: user.organizationId,
          },
          {
            isVerified: true,
            status: "active",
          }
        );
        const temp = organizationRegistrationSuccessTemplate(
          fullName ?? user.fullName,
          org.organizationName,
          org.organizationId
        );
        const subject = `Welcome to PostBuddy.ai – ${org.organizationName} is all set up!`;
        await sendEmail(temp, subject, user.email);
      }

      const temp = registrationSuccessTemplate(fullName ?? user.fullName);
      const subject = "Registration Successful - Welcome to Postbuddy.ai!";

      await sendEmail(temp, subject, user.email);

      responseHandler({ user: payload, token, redirect: "/plans" }, res);
    } else {
      const payload = {
        email: user.email,
        fullName: user.fullName,
        _id: user._id,
        profileUrl: user.profileUrl,
      };
      const token = generateToken(payload);
      responseHandler({ user: payload, token, redirect: "/plans" }, res);
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    errorHandler("ERR_VERIFY_OTP", res);
  }
};

export const resendOtp = async (req, res) => {
  try {
    const reqQuery = req.query;
    let filter = { email: reqQuery.email };
    const otp = await UserService.getOTP(filter);
    if (otp === "Limit exceeded") {
      return errorHandler(429, res, "Try Again after 10 minutes");
    }
    responseHandler("success", res, "Otp sent successfully", 200);
  } catch (error) {
    console.log(error);
    errorHandler("ERR_RESEND_OTP", res);
  }
};

export const getUser = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const user = await UserService.findById(id);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    const userBody = {
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      _id: user._id,
      isVerified: user.isVerified,
      status: user.status,
      profileUrl: user.profileUrl,
      role: user.role,
    };
    responseHandler(userBody, res, "User details fetched successfully", 201);
  } catch (error) {
    console.log(error);
    errorHandler("ERR_GET_USER", res);
  }
};

export const activeStatusUser = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const reqQuery = req.query;
    const user = await UserService.findById(id);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    user.status = user.status === "active" ? "inactive" : "active";
    user.deactivateReason = reqQuery.reason || "Others";
    await user.save();
    responseHandler(user.status, res, "User deactivated successfully", 201);
  } catch (error) {
    console.log(error);
    errorHandler("ERR_UPDATE_USER", res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const { fullName, profileImage } = req.body;
    const body = {
      fullName,
      profileUrl: profileImage,
    };
    const user = await UserService.findByIdAndUpdate(id, body);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    const userBody = {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    };
    const payload = {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    };
    const token = generateToken(payload);
    responseHandler({ userBody, token }, res, "User updated successfully", 201);
  } catch (error) {
    console.log(error);
    errorHandler("ERR_UPDATE_USER", res);
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    console.log("User ==> ", user);
    if (user.role !== "admin" && user.email !== "saurav@bytive.in") {
      return responseHandler(null, res, "Unauthorized User", 401);
    }
    const { email } = req.body;
    if (!email) {
      return errorHandler("ERR_INVALID_EMAIL", res);
    }

    const admin = await UserService.findOne({ email });
    if (!admin) {
      return responseHandler(null, res, "User not found", 401);
    }

    admin.role = "admin";
    await admin.save();

    responseHandler(admin.fullName, res, "User Upgraded to Admin", 200);
  } catch (error) {
    console.log("Error : ", error);
    errorHandler("ERR_UPDATE_USER", res);
  }
};
