import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import * as appointmentService from "../services/appointment.service";
import { supabase } from "../config/supabase";

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; 
    let includeAll = false;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      includeAll = profile?.role === "admin";
    }

    const appointments = await appointmentService.getAppointments(includeAll ? undefined : userId);

    res.json(appointments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    console.log(req.body);

    const appointmentData = {
      ...req.body,
      log_id: userId
    };

    const appointment = await appointmentService.createAppointment(appointmentData);

    res.status(201).json(appointment);

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Le statut est requis" });
    }

    const appointment = await appointmentService.updateAppointmentStatus(id, status);
    res.json(appointment);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
