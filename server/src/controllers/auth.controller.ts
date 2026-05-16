import type {Request, Response,} from "express";
import {registerUser, loginUser} from "../services/auth.service";
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

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (accessToken && refreshToken) {
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false, // modifié pour localhost HTTP
        sameSite: "lax", // modifié pour localhost HTTP
        maxAge: 1000 * 60 * 60, // 1h
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      });
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

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false, // modifiÃ© pour localhost HTTP
      sameSite: "lax", // modifiÃ© pour localhost HTTP
      maxAge: 1000 * 60 * 60, // 1h
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
    });

    res.json({ user: data.user });

  } catch (err: any) {

    res.status(500).json({
      error: err.message,
    });

  }
};



export const refreshSession = async (
  req: Request,
  res: Response
) => {
  try {

    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token manquant",
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return res.status(401).json({
        error: "Session invalide",
      });
    }

    const newAccessToken = data.session.access_token;
    const newRefreshToken = data.session.refresh_token;

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      user: data.user,
    });

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

    res.clearCookie("refresh_token");

    res.json({ message: "Déconnexion réussie" });
};