import { supabase } from "../config/supabase";

export const getTransactions = async () => {
  const { data, error } = await supabase.from("transactions").select("*");

  if (error) throw error;

  return data;
};

export const createTransaction = async (transaction: any) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteTransaction = async (id: number) => {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return { message: "Transaction supprimée" };
};

export const updateTransactionStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};
