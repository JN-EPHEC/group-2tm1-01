import { supabase } from "../config/supabase";

export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw new Error(error.message);

  return data;
};