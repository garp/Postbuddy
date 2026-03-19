import { ReportBug } from "../../models/admin/reportBug.models.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";

export const createReportBug = async (req, res) => {
  try {
    const bugData = req.value;
    const newBugReport = await ReportBug.create(bugData);

    return responseHandler("Bug report created successfully", res, newBugReport);
  } catch (error) {
    console.error("Error creating bug report:", error);
    return errorHandler("Failed to create bug report", res);
  }
};
