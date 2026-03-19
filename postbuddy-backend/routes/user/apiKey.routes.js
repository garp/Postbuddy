import { Router } from 'express'
import * as ApiKey from '../../controllers/user/apiKey.controller.js'
import { verifyToken } from '../../middlewares/auth.js';

const router = Router();

router.route('/').get(verifyToken, ApiKey.getApiKey)
router.route('/').post(verifyToken, ApiKey.addApiKey)
router.route('/').delete(verifyToken, ApiKey.removeApiKey)

export default router;