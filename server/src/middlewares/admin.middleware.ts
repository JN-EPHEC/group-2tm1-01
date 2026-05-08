import type {
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
    */

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