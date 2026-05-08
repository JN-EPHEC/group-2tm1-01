import type {Request, Response,} from "express";
import {registerUser, loginUser, getCurrentUser, logoutUser,} from "../services/auth.service";
import { supabase } from "../config/supabase";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      address
    } = req.body;

    const data = await registerUser(email, password);

    if (!data.user) {
      throw new Error("Utilisateur non créé");
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          role: "client",
          phone,
          address,
        }
      ]);

    if (dbError) {
      try {
        await supabase.auth.admin.deleteUser(data.user.id);
      } catch (e) {
        console.error("Rollback failed:", e);
      }
      throw new Error(dbError.message);
    }

    res.status(201).json({
      user: data.user,
    });

  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    const data = await loginUser(email, password);

    if (!data.session) {
      throw new Error("Session introuvable");
    }

    const token = data.session.access_token;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true, // true en production HTTPS
      sameSite: "none",
      maxAge: 1000 * 60 * 60, // 1h
    });

    res.json({ user: data.user });

  } catch (err: any) {

    res.status(500).json({
      error: err.message,
    });

  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Token invalide" });
    }

    res.json(data.user);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {
    res.clearCookie("access_token");

    res.json({ message: "Déconnexion réussie" });
};