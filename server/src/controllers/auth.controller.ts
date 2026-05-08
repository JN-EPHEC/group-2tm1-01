import type {Request, Response,} from "express";
import {registerUser, loginUser, getCurrentUser, logoutUser,} from "../services/auth.service";
import { supabase } from "../config/supabase";

export const register = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    const data =
      await registerUser(email, password);

    res.status(201).json(data);

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

    const token = data.session.access_token;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // true en production HTTPS
      sameSite: "lax",
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

    const { data, error } = await supabase.auth.getUser(token);

    if (error) throw error;

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