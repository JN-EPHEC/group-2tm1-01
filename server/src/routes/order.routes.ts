import { Router } from "express";
import * as controller from "../controllers/order.controller";

const router = Router();

router.get("/", controller.getOrders);

export default router;

// BRANCHER ROUTE DANS SERVER.TS
