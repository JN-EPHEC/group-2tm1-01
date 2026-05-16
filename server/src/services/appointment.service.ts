import { supabase } from "../config/supabase";

export const getAppointments = async () => {
  const { data, error } = await supabase.from("appointments").select("*");

  if (error) throw error;

  return data;
};

export const createAppointment = async (appointment: any) => {
  const {
    date,
    time,
    status,
    notes,
    log_id // ID du patient (lié à auth/profiles)
  } = appointment;

  const { data, error } = await supabase
    .from("appointments")
    .insert([{
      date,
      time,
      status,
      note: notes,
      log_id
    }])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateAppointmentStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};