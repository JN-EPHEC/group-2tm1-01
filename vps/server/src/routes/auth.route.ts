import { Router } from "express";

import {register, login, me, logout, refreshSession, updateProfile} from "../controllers/auth.controller.js";
import {protect,} from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription utilisateur
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       200:
 *         description: Utilisateur créé
 */
router.post(
  "/register",
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
router.post(
  "/login",
  login
);


/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir la session utilisateur
 *     description: Génère un nouveau access token à partir du refresh token stocké dans les cookies HTTP-only.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Session rafraîchie avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Informations de l'utilisateur connecté
 *       401:
 *         description: Refresh token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post("/refresh", refreshSession);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer utilisateur connecté
 *     tags: [Auth]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Informations utilisateur
 */
router.get(
  "/me",
  protect,
  me
);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Mise à jour du profil utilisateur
 *     tags: [Auth]
 *
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put(
  "/profile",
  protect,
  updateProfile
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post(
  "/logout",
  logout
);

export default router;