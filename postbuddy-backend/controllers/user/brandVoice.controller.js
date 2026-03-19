import BrandVoiceService from "../../service/user/brandVoice.service.js";
import * as UserService from "../../service/user/user.service.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";

export const getBrandVoice = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler({ message: "User not found" }, res, 404);
    }
    const brandVoice = await BrandVoiceService.findOne({ userId: user._id });
    if (!brandVoice) {
      return responseHandler({ message: "Brand voice not found" }, res, 404);
    }
    responseHandler(brandVoice, res, "Brand voice fetched successfully", 200);
  } catch (error) {
    errorHandler(error, res);
  }
};
export const createBrandVoice = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler({ message: "User not found" }, res, 404);
    }
    const {
      name,
      industry,
      toneOfVoice,
      personality,
      targetAudience,
      serviceSkills,
      uniqueStrengths,
      personalBackground,
      professionalExperience,
      personalMission,
    } = req.value;
    const body = {
      name,
      industry,
      toneOfVoice,
      personality,
      targetAudience,
      serviceSkills,
      uniqueStrengths,
      personalBackground,
      professionalExperience,
      personalMission,
      userId: user._id,
    };
    const summary = await BrandVoiceService.generateSummary(body);
    body.summary = summary;
    const brandVoice = await BrandVoiceService.create(body);
    responseHandler(
      brandVoice.summary,
      res,
      "Brand voice created successfully",
      200
    );
  } catch (error) {
    errorHandler(error, res);
    throw new Error(error);
  }
};

export const getAllBrandVoice = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler({ message: "User not found" }, res, 404);
    }
    let brandVoice;
    if (user.role == "orgAdmin" || user.role == "orgUser") {
      const { admins, members } = await UserService.orgCommentDetails(
        user.email
      );
      brandVoice = await BrandVoiceService.findAll({
        userId: { $in: [...admins, ...members] },
      });
    } else {
      brandVoice = await BrandVoiceService.findAll({ userId: user._id });
    }
    responseHandler(brandVoice, res, "Brand voice fetched successfully", 200);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const activateBrandVoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler({ message: "User not found" }, res, 401);
    }
    const brandVoice = await BrandVoiceService.findById(id);
    if (!brandVoice) {
      return responseHandler({ message: "Brand voice not found" }, res, 404);
    }
    await BrandVoiceService.activateBrandVoice(brandVoice._id, userId);
    responseHandler(brandVoice, res, "Brand voice activated successfully", 200);
  } catch (error) {
    errorHandler(error, res);
    throw new Error(error);
  }
};

export const deleteBrandVoice = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler({ message: "User not found" }, res, 404);
    }
    const brandVoice = await BrandVoiceService.findById(id);
    if (!brandVoice) {
      return responseHandler({ message: "Brand voice not found" }, res, 404);
    }
    console.log("brandVoice : ", brandVoice);
    await BrandVoiceService.findByIdAndDelete(brandVoice._id);
    responseHandler(brandVoice, res, "Brand voice deleted successfully", 200);
  } catch (error) {
    errorHandler(error, res);
    throw new Error(error);
  }
};
