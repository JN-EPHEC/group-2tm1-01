import { supabase } from "../config/supabase";

export const getCart = async () => {
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `);

  if (error) throw error;

  return data;
};

export const addToCart = async (item: any) => {
  const {
    productId,
    quantity,
  } = item;

  if (!productId || !quantity) {
    throw new Error(
      "productId et quantity sont requis"
    );
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert([
      {
        product_id: productId,
        quantity,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateCartItem = async (
  id: number,
  quantity: number
) => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({
      quantity,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const removeCartItem = async (
  id: number
) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const clearCart = async () => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .neq("id", 0);

  if (error) throw error;
};