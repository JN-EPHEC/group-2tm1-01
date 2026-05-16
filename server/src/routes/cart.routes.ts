import { Router } from "express";
import * as cartController from "../controllers/cart.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestion du panier utilisateur
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Récupérer le panier
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Panier récupéré avec succès
 */
router.get("/", cartController.getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Ajouter un produit au panier
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Produit ajouté au panier
 */
router.post("/items", cartController.addToCart);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Modifier la quantité d'un produit du panier
 *     tags: [Cart]
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
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 */
router.put("/items/:id", cartController.updateCartItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Supprimer un produit du panier
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit supprimé du panier
 */
router.delete("/items/:id", cartController.removeCartItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Vider le panier
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Panier vidé
 */
router.delete("/clear", cartController.clearCart);

export default router;