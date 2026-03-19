import { Router } from "express";
import * as BrandVoice from "../../controllers/user/brandVoice.controller.js";
import { verifyToken } from "../../middlewares/auth.js";
import validate from "../../middlewares/validator.js";
import { createBrandVoiceSchema } from "../../validator/user.validator.js";

const router = Router();

router
  .route("/")
  .post(
    verifyToken,
    validate(createBrandVoiceSchema),
    BrandVoice.createBrandVoice
  );
router.route("/").get(verifyToken, BrandVoice.getAllBrandVoice);
router.route("/:id").put(verifyToken, BrandVoice.activateBrandVoice);
router.route("/:id").delete(verifyToken, BrandVoice.deleteBrandVoice);

export default router;
