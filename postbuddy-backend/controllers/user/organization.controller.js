import OrganizationService from "../../service/user/organization.service.js";
import * as UserService from "../../service/user/user.service.js";
import { organizationInviteTemplate } from "../../template/email.js";
import { generateInviteLink } from "../../utils/helper.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const getOrganization = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const user = await UserService.findById(id);
    if (!user) {
      return responseHandler(null, res, "User not found", 404);
    }
    const query = [
      {
        $match: {
          _id: user.organizationId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "orgAdmin",
          foreignField: "_id",
          as: "adminDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "membersDetails",
        },
      },
    ];
    console.log("Organization Query ==> ", JSON.stringify(query));
    const organization = await OrganizationService.aggregate(query);
    console.log("Organization ==> ", organization);
    responseHandler(
      organization,
      res,
      "Organization fetched successfully",
      200
    );
  } catch (error) {
    console.log(error);
    errorHandler("ERR_GET_ORGANIZATION", res);
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const reqBody = req.body;
    const orgUser = await UserService.findById(userId);
    if (!orgUser) {
      return responseHandler(null, res, "User not found", 404);
    }
    if(reqBody.email === orgUser.email){
      return responseHandler(null, res, "You cannot invite yourself", 400);
    }

    if (orgUser.role !== "orgAdmin") {
      return responseHandler(
        null,
        res,
        "You cannot invite users to your organization",
        403
      );
    }
    if (!reqBody.email) {
      return errorHandler("ERR_INVALID_EMAIL", res);
    }
    console.log("Org User ==> ", orgUser);
    const organization = await OrganizationService.findOne({
      _id: orgUser.organizationId,
    });
    if (!organization) {
      return errorHandler("ERR_ORGANIZATION_NOT_FOUND", res);
    }
    const body = {
      fullName: reqBody.email.split("@")[0],
      email: reqBody.email,
      type: "organization",
      organizationId: organization._id,
      role: "orgUser",
      inviteStatus: "pending",
    };
    const user = await UserService.create(body);
    await OrganizationService.update(
      {
        organizationId: organization.organizationId,
      },
      { $push: { members: user._id } }
    );
    if (!user) {
      return errorHandler("ERR_USER_CREATION_FAILED", res);
    }
    const inviteLink = generateInviteLink(
      organization.organizationId,
      reqBody.email
    );
    const temp = organizationInviteTemplate(
      user.fullName,
      organization.organizationName,
      orgUser.fullName,
      inviteLink
    );
    const subject = "Invite to join Postbuddy.ai Organization";
    await sendEmail(temp, subject, reqBody.email);
    responseHandler(user, res, "User invited successfully", 200);
  } catch (error) {
    console.log(error);
    errorHandler("ERR_INVITE_USER", res);
    throw new Error(error);
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { email, organizationId } = req.body;
    const organization = await OrganizationService.findOne({
      organizationId: organizationId,
    });
    if (!organization) {
      return responseHandler(null, res, "Organization not found", 404);
    }
    const user = await UserService.findOne({
      email: email,
      organizationId: organization._id,
      inviteStatus: "pending",
    });
    if (!user) {
      return responseHandler(null, res, "Something went wrong", 500);
    }
    const updatedUser = await UserService.findByIdAndUpdate(user._id, {
      $set: { inviteStatus: "accepted" },
    });

    const updatedOrganization = await OrganizationService.update(
      { organizationId: organizationId },
      { $push: { members: user._id } }
    );

    if (!updatedOrganization) {
      return responseHandler(null, res, "Failed to update organization", 500);
    }
    if (!updatedUser) {
      return responseHandler(null, res, "Something went wrong", 500);
    }
    const data = {
      purpose: "login",
      isVerified: false,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
    };

    // Send OTP
    let filter = { email: user.email, purpose: "register" };
    const otp = await UserService.getOTP(filter);
    if (otp === "Limit exceeded") {
      return responseHandler(null, res, "Try again after 10 mins", 429);
    }
    return responseHandler(
      {
        purpose: "login",
        isVerified: user.isVerified,
        email: user.email,
        fullName: user.fullName,
      },
      res,
      "Verify account",
      200
    );
  } catch (error) {
    console.log(error);
    errorHandler("ERR_ACCEPT_INVITE", res);
    throw new Error(error);
  }
};

export const joinOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { email } = req.query;
    const user = await UserService.findOne({ email });
    if (!user) {
      return errorHandler("ERR_USER_NOT_FOUND", res);
    }
    if (user.inviteStatus === "accepted") {
      return responseHandler(null, res, "User already joined", 200);
    }
    if (!organizationId) {
      return errorHandler("ERR_ORGANIZATION_ID_REQUIRED", res);
    }
    const organization = await OrganizationService.findOne({ organizationId });
    if (!organization) {
      return errorHandler("ERR_ORGANIZATION_NOT_FOUND", res);
    }
    return responseHandler(organization, res, "Organization ID", 200);
  } catch (error) {
    console.log(error);
    errorHandler("ERR_JOIN_ORGANIZATION", res);
  }
};
