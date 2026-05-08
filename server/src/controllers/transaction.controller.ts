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
