import { Router } from 'express'
import * as Plans from '../controllers/plan.controller.js'

const router = Router();

router.route('/').post(Plans.createPlans);
router.route('/').get(Plans.findAllPlans);
router.route('/:id').get(Plans.findPlans);
router.route('/:id').put(Plans.updatePlans);
router.route('/:id').delete(Plans.deletePlans);


export default router;