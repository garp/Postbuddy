import * as RoadMap from '../../../controllers/admin/static_page.js/productroadmap.controller.js'
import { verifyToken } from '../../../middlewares/auth.js'

import { Router } from 'express'
const router = Router()

router.route('/').post(verifyToken, RoadMap.createRoadMap)
router.route('/').get(RoadMap.getAllRoadMap)
router.route('/:roadmapId').put(verifyToken,RoadMap.upvoteRoadMap)

export default router