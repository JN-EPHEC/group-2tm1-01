import type { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getTransactions = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createTransaction = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("transactions").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const { data, error } = await supabase.from("transactions").update({ status }).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};
