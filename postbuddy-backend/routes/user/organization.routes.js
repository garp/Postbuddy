import { Router } from "express";
import * as Organization from "../../controllers/user/organization.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

router.route("/").get(verifyToken, Organization.getOrganization);
router.route("/invite").post(verifyToken, Organization.inviteUser);
router.route("/accept-invite").put(Organization.acceptInvite);
router
  .route("/join/:organizationId")
  .get(Organization.joinOrganization);

export default router;
