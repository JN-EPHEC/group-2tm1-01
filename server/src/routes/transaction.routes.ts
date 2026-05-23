import { Router } from "express";
import * as controller from "../controllers/transaction.controller";

const router = Router();

router.get("/", controller.getTransactions);
router.post("/", controller.createTransaction);
router.delete("/:id", controller.deleteTransaction);
router.put("/:id/status", controller.updateTransactionStatus);

export default router;

// BRANCHER ROUTE DANS SERVER.TS
