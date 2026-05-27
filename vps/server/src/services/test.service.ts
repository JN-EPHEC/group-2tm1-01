import { supabase } from "../config/supabase";

export const testProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Erreur:", error);
    return;
  }

  console.log("Produits:", data);
};
