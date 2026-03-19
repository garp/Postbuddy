import { Router } from "express";
import * as Transaction from "../../controllers/payment/transaction.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

router.route("/create").post(verifyToken, Transaction.createOrder);
router.route("/verify").post(Transaction.verifyWebhook);
router.route("/create-transaction").post(verifyToken, Transaction.createTransaction);
router.route("/").get(verifyToken, Transaction.getAllTransactions);
router.route("/verify-transaction").get(verifyToken, Transaction.verifyTransaction);

export default router;
