import { Router } from 'express'
import validate from '../../middlewares/validator.js';
import { requestFeatureValidator } from '../../validator/admin/reportBug.validator.js'
import { createFeatureRequest } from '../../controllers/admin/requestFeature.controller.js';
const router = Router();

router.route('/').post(validate(requestFeatureValidator), createFeatureRequest)

export default router