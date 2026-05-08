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
    firstName,
    lastName,
    contact
  } = appointment;

  const { data, error } = await supabase
    .from("appointments")
    .insert([{
      date,
      time,
      status,
      notes,
      first_name: firstName,
      last_name: lastName,
      contact
    }])
    .select()
    .single();

  if (error) throw error;

  return data;
};