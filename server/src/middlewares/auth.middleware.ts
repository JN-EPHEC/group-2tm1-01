import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { supabase }
from "../config/supabase.js";

export interface AuthRequest
extends Request {

  user?: any;

}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    // On récupère le token via les cookies
    let token = req.cookies?.access_token;

    // Alternative: si le token vient du header Authorization (Bearer ...)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {

      return res.status(401).json({
        error: "Token invalide",
      });
    }

    const { data, error } =
      await supabase.auth.getUser(token);

    if (error || !data.user) {

      return res.status(401).json({
        error: "Non autorisé",
      });

    }

    req.user = token;

    next();

  } catch (err: any) {

    res.status(500).json({
      error: err.message,
    });

  }

};