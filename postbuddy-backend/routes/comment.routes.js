import { Router } from "express";
import * as comment from "../controllers/comment/comment.controller.js";
import * as graph from "../controllers/comment/graph.controller.js";
import * as bot from "../controllers/comment/bot.controller.js";
import * as chat from "../controllers/comment/chat.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.route("/").post(verifyToken, comment.generateComment);
router.route("/count").get(verifyToken, comment.credsLeft);
router.route("/graph").get(verifyToken, graph.graphData);
router.route("/bot").post(verifyToken, bot.BotRequest);
router.route("/chat").post(verifyToken, chat.generateChat);
router.route("/recreate").post(verifyToken,chat.recreatePost);
router.route("/commentsData").get(verifyToken,comment.getCommentsData);
router.route("/fixGrammar").post(verifyToken, comment.fixGrammar);

export default router;