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

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        error: "Token manquant",
      });

    }

    const token = req.cookies?.access_token;

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