/*import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthRequest,
} from "./auth.middleware.js";

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = req.user;

    if (!user) {

      return res.status(401).json({
        error: "Non autorisé",
      });

    }

    /*
      IMPORTANT :
      ici tu vérifieras :
      user role = admin
    

    const role =
      user.user_metadata?.role;

    if (role !== "admin") {

      return res.status(403).json({
        error: "Accès interdit",
      });

    }

    next();

  } catch (err: any) {

    res.status(500).json({
      error: err.message,
    });

  }

};
*/

import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import { supabase } from "../config/supabase.js"; 
// 💡 IMPORTANT : Vérifie bien que le chemin ci-dessus correspond à ton instance de client Supabase !
// Si ton dossier s'appelle "middlewares" ou "middleware", adapte les chemins d'importation.

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. On extrait l'utilisateur fourni par le middleware "protect"
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Non autorisé : Session utilisateur introuvable ou expirée",
      });
    }

    console.log("Vérification du rôle administrateur pour l'ID :", user.id);

    // 2. Requête directe sur la table publique profiles pour éviter les métadonnées obsolètes
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du profil Supabase :", error.message);
      return res.status(403).json({ error: "Impossible de vérifier les permissions" });
    }

    if (!profile || profile.role !== "admin") {
      console.warn(`L'utilisateur ${user.id} a tenté une action admin mais possède le rôle : ${profile?.role}`);
      return res.status(403).json({
        error: "Accès interdit : Cet espace est réservé aux administrateurs",
      });
    }

    // L'utilisateur est bien admin, on passe à l'action suivante (remove) !
    next();
  } catch (err: any) {
    console.error("Crash du middleware adminOnly :", err);
    res.status(500).json({
      error: err.message,
    });
  }
};