import type { Request, Response } from "express";

import * as appointmentService from "../services/appointment.service";

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAppointments();

    res.json(appointments);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {

    console.log(req.body);

    const appointment = await appointmentService.createAppointment(req.body);

    res.status(201).json(appointment);

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};
