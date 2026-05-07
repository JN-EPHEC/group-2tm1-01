import { Router } from "express";
import { getAll } from "../controllers/product.controller";

const router = Router();

router.get("/", getAll);

console.log('ok');
export default router;