import { Router } from 'express'
import { createContactUs } from '../../controllers/admin/contactus.controller.js'
const router = Router();

router.route('/').post(createContactUs)

export default router;
