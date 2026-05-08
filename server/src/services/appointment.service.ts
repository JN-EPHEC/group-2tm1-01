import { supabase } from "../config/supabase";

export const getAppointments = async () => {
  const { data, error } = await supabase.from("appointments").select("*");

  if (error) throw error;

  return data;
};

export const createAppointment = async (appointment: any) => {
  const { date, time, status, notes } = appointment;
  const { data, error } = await supabase
    .from("appointments")
    .insert([{ date, time, status, notes,}])
    .select()
    .single();

  if (error) throw error;

  return data;
};
