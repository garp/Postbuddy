import { errorHandler, responseHandler } from "../utils/responseHandler.js";
import { uploadFileToS3, generatePublicS3FileUrl } from "../utils/fileUpload.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorHandler("No file uploaded", res, 400);
    }
    const uploadedFile = await uploadFileToS3(req.file);
    const fileUrl = await generatePublicS3FileUrl(uploadedFile.Key);

    return responseHandler(fileUrl, res, "File uploaded successfully",);
  } catch (error) {
    console.error("Upload error:", error);
    return errorHandler(error.message, res);
  }
};
export const uploadMiddleware = upload.single("file");
