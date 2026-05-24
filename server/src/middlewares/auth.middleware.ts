import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { supabase } from "../config/supabase.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};