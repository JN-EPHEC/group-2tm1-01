import { supabase } from "../config/supabase";

export const getOrders = async () => {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) throw error;

  return data;
};
