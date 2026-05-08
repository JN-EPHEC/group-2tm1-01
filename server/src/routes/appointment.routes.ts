import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gestion des rendez-vous
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Récupérer tous les rendez-vous
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     example: "2026-05-08T10:00:00Z"
 *                   patientName:
 *                     type: string
 *                   reason:
 *                     type: string
 */
router.get("/", appointmentController.getAppointments);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Créer un rendez-vous
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - patientName
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-05-08T10:00:00Z"
 *               patientName:
 *                 type: string
 *                 example: "Jean Dupont"
 *               reason:
 *                 type: string
 *                 example: "Consultation douleur dos"
 *     responses:
 *       201:
 *         description: Rendez-vous créé
 *       400:
 *         description: Données invalides
 */
router.post("/", appointmentController.createAppointment);

export default router;

