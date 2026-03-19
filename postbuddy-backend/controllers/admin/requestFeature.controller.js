import { RequestFeature } from "../../models/admin/requestFeature.model.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";

export const createFeatureRequest = async (req, res) => {
  try {
    const featureData = req.value;
    await RequestFeature.create(featureData);

    return responseHandler(null, res, "Bug report created successfully",);
  } catch (error) {
    console.error("Error creating bug report:", error);
    return errorHandler("Failed to create bug report", res);
  }
};
