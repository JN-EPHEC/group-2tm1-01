import { supabase } from "../config/supabase";

export const getOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .order("order_date", { ascending: false });

  if (error) throw error;

  return data;
};

export const getOrderById = async (id: number) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

export const createOrder = async (userId: number, order: any) => {
  const {
    firstName,
    lastName,
    email,
    address,
    paymentMethod,
    items,
  } = order;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !address ||
    !paymentMethod
  ) {
    throw new Error("Informations client manquantes");
  }

  if (!items || items.length === 0) {
    throw new Error("Le panier est vide");
  }

  let total = 0;

  const orderItems: any[] = [];

  for (const item of items) {
    const { data: product, error } = await supabase
      .from("products")
      .select("id, price")
      .eq("id", item.productId)
      .single();

    if (error || !product) {
      throw new Error(`Produit introuvable : ${item.productId}`);
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const tax = total * 0.2;

  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        total,
        tax,
        status: "pending",
        payment_method: paymentMethod,
        delivery_address: address,
        order_date: new Date(),
      },
    ])
    .select()
    .single();

  if (orderError || !createdOrder) {
    throw orderError;
  }

  const formattedItems = orderItems.map((item) => ({
    order_id: createdOrder.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(formattedItems);

  if (itemsError) {
    throw itemsError;
  }

  return {
    order: createdOrder,
    items: formattedItems,
  };
};

export const updateOrderStatus = async (id: number, status: string) => {
  const allowedStatus = ["pending", "paid", "shipped", "cancelled"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Statut invalide");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteOrder = async (id: number) => {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return { message: "Commande supprimée" };
};