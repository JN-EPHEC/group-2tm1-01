import { Router } from "express";
import { getTransactions, createTransaction, updateTransactionStatus, deleteTransaction } from "../controllers/transaction.controller";

const router = Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.patch("/:id/status", updateTransactionStatus);
router.delete("/:id", deleteTransaction);

export default router;
