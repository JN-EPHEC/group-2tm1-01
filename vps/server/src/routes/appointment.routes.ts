import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller";
import { protect } from "../middlewares/auth.middleware";

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
router.get("/", protect, appointmentController.getAppointments);

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
 *               - time
 *               - firstName
 *               - lastName
 *               - contact
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-05-08"
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               status:
 *                 type: string
 *                 example: "pending"
 *               notes:
 *                 type: string
 *                 example: "Douleur au dos"
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               contact:
 *                 type: string
 *                 example: "0470123456"
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", protect, appointmentController.createAppointment);

router.put("/:id/status", protect, appointmentController.updateAppointmentStatus);

export default router;

