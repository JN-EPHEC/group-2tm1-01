import type { Request, Response } from "express";
import * as service from "../services/transaction.service";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const data = await service.getTransactions();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const newTransaction = await service.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await service.deleteTransaction(id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Le statut est requis" });
    }

    const updated = await service.updateTransactionStatus(id, status);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
