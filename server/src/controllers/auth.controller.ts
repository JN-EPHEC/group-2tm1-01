import type {Request, Response,} from "express";
import {registerUser, loginUser} from "../services/auth.service";
import { supabase } from "../config/supabase";
import * as argon2 from "argon2";

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

    // Validation du mot de passe: 8-20 caractères, 1 min, 1 maj, 1 chiffre, 1 car. spéc.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_]).{8,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Le mot de passe doit contenir entre 8 et 20 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
      });
    }

    const data = await registerUser(email, password);

    if (!data.user) {
      throw new Error("Utilisateur non créé");
    }

    const hashedPassword = await argon2.hash(password);

    const { error: dbError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          password: hashedPassword,
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

    if (data.session) {
      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60, // 1h
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      });
    } else {
      // Si la session n'est pas retournée (ex: confirmation email requise), on logge manuellement
      try {
        const loginData = await loginUser(email, password);
        if (loginData.session) {
          res.cookie("access_token", loginData.session.access_token, {
            httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60,
          });
          res.cookie("refresh_token", loginData.session.refresh_token, {
            httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 7,
          });
        }
      } catch (loginErr) {
        console.log("Auto-login failed:", loginErr);
      }
    }

    res.status(201).json({
      user: { ...data.user, role: "client" },
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

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .maybeSingle();

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60, // 1h
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
    });

    res.json({ user: { ...data.user, role: profileData?.role || "client" } });

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
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
      return res.status(200).json({ isAuthenticated: false });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(200).json({ isAuthenticated: false });
    }

    // 🔥 Correction : On va chercher le prénom, nom, téléphone et adresse complémentaires dans la table profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, address, role")
      .eq("id", data.user.id)
      .maybeSingle();

    res.json({
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      role: profileData?.role || "client",
      user_metadata: {
        prenom: profileData?.first_name || "",
        nom: profileData?.last_name || "",
        phone: profileData?.phone || "",
        adresse: profileData?.address || "",
        role: profileData?.role || "client"
      }
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const { prenom, nom, phone, adresse } = req.body;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: prenom,
        last_name: nom,
        phone: phone,
        address: adresse
      })
      .eq("id", data.user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    res.json({ message: "Profil mis à jour" });
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
