import { Router } from 'express'
import * as user from '../../controllers/user/user.controller.js';
import validate from '../../middlewares/validator.js';
import { verifyOtp, loginWithOtpSchema, updateUserSchema } from '../../validator/user.validator.js'
import { verifyToken } from '../../middlewares/auth.js';

const router = Router();

router.route('/').get(verifyToken, user.getUser)
router.route('/deactive').get(verifyToken, user.activeStatusUser)
router.route('/update').put(verifyToken, validate(updateUserSchema), user.updateUser)
router.route('/loginWithOtp').post(validate(loginWithOtpSchema), user.loginWithOtp)
router.route('/verifyOtp').post(validate(verifyOtp), user.verifyOtp)
router.route('/resendOtp').get(user.resendOtp)
router.route('/admin').post(verifyToken, user.createAdmin)

export default router;