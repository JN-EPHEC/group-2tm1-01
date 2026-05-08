import { Router } from "express";

import * as appointmentController from "../controllers/appointment.controller";

const router = Router();

router.get("/", appointmentController.getAppointments);

router.post("/", appointmentController.createAppointment);

export default router;

// BRANCHER ROUTE DANS SERVER.TS
