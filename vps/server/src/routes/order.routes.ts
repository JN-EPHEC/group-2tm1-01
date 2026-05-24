import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes (création, consultation, mise à jour et suppression)
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Orders]
 *     description: Retourne la liste de toutes les commandes avec leurs articles associés.
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
router.get("/", protect, orderController.getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Orders]
 *     description: Retourne une commande spécifique avec ses articles et produits associés.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande trouvée
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", protect, orderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     description: Crée une commande pour l'utilisateur connecté et calcule automatiquement le total et la TVA.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
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
 *                 example: jean.dupont@email.com
 *               address:
 *                 type: string
 *                 example: Rue de Bruxelles 10, 1000 Bruxelles
 *               paymentMethod:
 *                 type: string
 *                 example: paypal
 *               items:
 *                 type: array
 *                 description: Liste des produits dans la commande
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Données invalides ou panier vide
 *       500:
 *         description: Erreur serveur
 */
router.post("/", protect, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Modifier le statut d'une commande
 *     tags: [Orders]
 *     description: Permet de mettre à jour le statut d'une commande (pending, paid, shipped, cancelled).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: paid
 *                 enum:
 *                   - pending
 *                   - paid
 *                   - shipped
 *                   - cancelled
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Statut invalide
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/status", orderController.updateOrderStatus);
router.put("/:id/status", orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Orders]
 *     description: Supprime une commande ainsi que ses relations (order_items).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", orderController.deleteOrder);

export default router;
