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

export const createOrder = async (userId: string, order: any) => {
  const {
    address,
    paymentMethod,
    items,
  } = order;

  if (
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
      prod_id: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  // Calcul de la taxe (ex: 21%)
  const tax = total * 0.21;

  // Création de la commande principale dans `orders`
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert([{
      log_id: userId,
      total: total,
      tax: tax,
      order_date: new Date().toISOString(),
      status: 'pending',
      delivery_address: address,
      payment_method: paymentMethod
    }])
    .select()
    .single();

  if (orderError || !newOrder) {
    throw new Error(orderError?.message || "Erreur création commande");
  }

  // Ajout de l'ID de commande généré aux éléments du panier
  const itemsToInsert = orderItems.map(item => ({
    ...item,
    order_id: newOrder.id
  }));

  // Création des entrées dans `order_items`
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return newOrder;
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