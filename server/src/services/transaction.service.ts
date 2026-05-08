import { supabase } from "../config/supabase";

export const getTransactions = async () => {
  const { data, error } = await supabase.from("transactions").select("*");

  if (error) throw error;

  return data;
};
