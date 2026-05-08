import { supabase } from "../config/supabase";

export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw new Error(error.message);

  return data;
};

export const getProductById = async (id: number) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createProduct = async (product: any) => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProduct = async (
  id: number,
  product: any
) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteProduct = async (id: number) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Produit supprimé avec succès"
  };
};