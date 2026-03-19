import { Router } from 'express'
import * as Subscription from '../../controllers/payment/subscription.controller.js'
import { verifyToken } from '../../middlewares/auth.js';

const router = Router();

router.route('/').get(verifyToken, Subscription.findSubscription);
router.route('/cancel').post(verifyToken, Subscription.cancelSubscription)
router.route('/active').get(verifyToken, Subscription.subscriptionActive)
router.route('/').delete(verifyToken, Subscription.deleteSubscription)


export default router;