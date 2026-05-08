import { Router } from "express";
import * as controller from "../controllers/transaction.controller";

const router = Router();

router.get("/", controller.getTransactions);

export default router;

// BRANCHER ROUTE DANS SERVER.TS
