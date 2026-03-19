import { verifyToken } from "../middlewares/auth.js";
import * as graph from "../controllers/comment/graph.controller.js"
import { Router } from "express";
const router = Router();

router.route("/total-graph").get(verifyToken, graph.totalCommentGraph);

export default router;