import { Router } from "express";
import { uploadFile, uploadMiddleware } from "../controllers/FileUpload.js";

const router = Router();

router.route("/upload").post(uploadMiddleware, uploadFile);

export default router;
