import { Router } from "express";
import * as orderController from "../controllers/order.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get("/", orderController.getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande trouvée
 *       404:
 *         description: Commande introuvable
 */
router.get("/:id", orderController.getOrderById);

/**
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - address
 *               - paymentMethod
 *               - items
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *               email:
 *                 type: string
 *                 example: jean@test.be
 *               address:
 *                 type: string
 *                 example: Rue de Bruxelles 10
 *               paymentMethod:
 *                 type: string
 *                 example: paypal
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Commande créée
 */
router.post("/", orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Modifier le statut d'une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: paid
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch("/:id/status", orderController.updateOrderStatus);

export default router;
