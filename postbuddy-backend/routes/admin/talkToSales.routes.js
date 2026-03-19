import { Router } from 'express'
import { createTalkToSales } from '../../controllers/admin/talkToSales.controller.js';
// import validate from '../../middlewares/validator.js';
const router = Router();

router.route('/').post(createTalkToSales)

export default router