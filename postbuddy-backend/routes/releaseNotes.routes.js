import { Router } from 'express'

import { create, getAll } from '../controllers/admin/releaseNotes.controller.js'
import { createValidator } from '../validator/releaseNotes.validator.js'
import validate from '../middlewares/validator.js';

const router = Router();

router.route('/create-notes').post(validate(createValidator), create)
router.route('/').get(getAll)

export default router;