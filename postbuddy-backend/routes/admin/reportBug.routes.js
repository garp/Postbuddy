import { Router } from 'express'
import { createReportBug } from '../../controllers/admin/reportBug.controller.js';
import validate from '../../middlewares/validator.js';
import { reportBugValidator, requestFeatureValidator } from '../../validator/admin/reportBug.validator.js'
import { createFeatureRequest } from '../../controllers/admin/requestFeature.controller.js';
const router = Router();

router.route('/').post(validate(reportBugValidator), createReportBug)
router.route('/feature-request').post(validate(requestFeatureValidator), createFeatureRequest)

export default router